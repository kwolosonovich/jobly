const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {
  /** Find all companies (can filter on terms in data). */

  static getAll = async(data) => {
    let baseQuery = `SELECT handle, name FROM companies`;
    let whereExpressions = [];
    let queryValues = [];

    if (+data.min_employees >= +data.max_employees) {
      throw new ExpressError(
        "Min employees must be less than max employees",
        400
      );
    }

    // Add to whereExpressions and queryValues to generate SQL queries

    if (data.min_employees) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`num_employees >= $${queryValues.length}`);
    }

    if (data.max_employees) {
      queryValues.push(+data.max_employees);
      whereExpressions.push(`num_employees <= $${queryValues.length}`);
    }

    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    // Finalize query and return results

    let search =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY name";
    const result = await db.query(search, queryValues);

    if (!queryValues) {
      throw new ExpressError('No matching companies found', 400)
    }
    return result.rows;
  }

  // get company by handle

  static handleName = async(handle) => {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
            FROM companies
            WHERE handle = $1`,
      [handle]
    );

    const company = result.rows[0];

    if (!company) {
      throw new ExpressError('Company not found', 404);
    }

    // const jobsResult = await db.query(
    //   `SELECT id, title, salary, equity
    //         FROM jobs 
    //         WHERE company_handle = $1`,
    //   [handle]
    // );

    // company.jobs = jobsResult.rows;

    return company;
  }

  // add new company 

  static add = async(data) => {
    const result = await db.query(
      `SELECT handle 
            FROM companies 
            WHERE handle = $1`,
      [data.handle]
    );

    if (result.rows[0]) {
      throw new ExpressError(
        `Company handle '${data.handle}' already taken`,
        400
      );
    }

    const newCompany = await db.query(
      `INSERT INTO companies 
              (handle, name, num_employees, description, logo_url)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING handle, name, num_employees, description, logo_url`,
      [
        data.handle,
        data.name,
        data.num_employees,
        data.description,
        data.logo_url
      ]
    );

    return newCompany.rows[0];
  }

  // update company

  static update = async(handle, data) => {
    let { query, values } = sqlForPartialUpdate(
      "companies",
      data,
      "handle",
      handle
    );

    const result = await db.query(query, values);
    const company = result.rows[0];

    if (!company) {
      throw new ExpressError("Company not found", 404);
    }

    return company;
  }

  // delete company

  static delete = async(handle) => {
    const result = await db.query(
      `DELETE FROM companies 
          WHERE handle = $1 
          RETURNING handle`,
      [handle]
    );

    if (result.rows.length === 0) {
      throw new ExpressError("Company not found", 404);
    }
    return result.rows[0]
  }
}

module.exports = Company;