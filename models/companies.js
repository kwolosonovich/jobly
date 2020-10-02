const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Company {
  // get all companies
  static getAll = async () => {
    console.log("getAll");
    const result = await db.query(`SELECT * FROM companies`);
    return result.rows;
  };

  // get company by input handle
  static getByHandle = async (inputHandle) => {
    console.log("getByHandle");
    const result = await db.query(
      `SELECT name, num_employees, description, logo_url
              FROM companies
              WHERE handle = $1`,
      [inputHandle]
    );
    return result;
  };

  //create company
//   static async create(data) {
//     const duplicateCheck = await db.query(
//       `SELECT handle 
      
//             FROM companies 
//             WHERE handle = $1`,
//       [data.handle]
//     );

//     if (duplicateCheck.rows[0]) {
//       throw new ExpressError(
//         `There already exists a company with handle '${data.handle}`,
//         400
//       );
//     }

//     const result = await db.query(
//       `INSERT INTO companies 
//               (handle, name, num_employees, description, logo_url)
//             VALUES ($1, $2, $3, $4, $5) 
//             RETURNING handle, name, num_employees, description, logo_url`,
//       [
//         data.handle,
//         data.name,
//         data.num_employees,
//         data.description,
//         data.logo_url,
//       ]
//     );

//     return result.rows[0];
//   }
}

module.exports = Company;
