const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Job {
  static async getAll(data) {
    let baseQuery = "SELECT id, title, company_handle FROM jobs";
    let whereExpressions = [];
    let queryValues = [];

    // Add to whereExpressions and queryValues to generate SQL queries

    if (data.min_salary) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`min_salary >= $${queryValues.length}`);
    }

    if (data.max_equity) {
      queryValues.push(+data.max_employees);
      whereExpressions.push(`min_equity >= $${queryValues.length}`);
    }

    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    // finalize query and return results

    let search =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY title";
    const result = await db.query(search, queryValues);

    if (!queryValues) {
      throw new ExpressError("No matching companies found", 404);
    }
    return result.rows;
  }

  // get job by id 

  static getID = async(id) => {
    const result = await db.query(
        `SELECT title, salary, equity, company_handle 
        FROM jobs 
        WHERE id = $1`,
        [id] 
    );
    const job = result.rows[0]
    if (!job) {
      throw new ExpressError('Match not found', 400)
    }
    return job;
  }

  // add new job

  static add = async(data) => {
    const result = await db.query(
      `INSERT INTO jobs 
      (title, salary, equity, company_handle) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle`, 
      [
        data.title, 
        data.salary, 
        data.equity, 
        data.company_handle
      ]
    )
    return result.rows[0]
  }

  // update job
  static update = async(id, data) => {
    let { query, values } = sqlForPartialUpdate(
      "jobs",
      data,
      "id",
      id
    );
    const result = await db.query(query, values);
    const job = result.rows[0]
    if (!job) {
      throw new ExpressError("Job not found", 404);  
    }
    return job
  }

  // delete job 

  static delete = async(id) => {
    const result = await db.query(
      `DELETE FROM jobs 
      WHERE id = $1
      RETURNING id`,
      [id]
    )
  if (result.rows.length === 0) {
    throw new ExpressError("Job not found", 404);
  }
  return result.rows[0]
  }

}

module.exports = Job;