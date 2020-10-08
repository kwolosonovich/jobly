const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


class User {

    static getAll = async() => {
        const result = await db.query(
          `SELECT username, first_name, last_name 
            FROM users`
        );
        return result.rows
    } 

    static getUser = async(username) => {
      const result = await db.query(
        `SELECT username, first_name, last_name, email, photo_url
            FROM users
            WHERE username = $1`,
            [username]
      )
      const user = result.rows[0];
      if (!user) {
        throw new ExpressError("Match not found", 404);
      }
      return user;
    }

    static add = async(data) => {
        const result = await db.query(
          `INSERT INTO users 
                (username, password, first_name, last_name, email, photo_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING username, first_name, last_name, email, photo_url`,
            [
                data.username,
                data.password, 
                data.first_name,
                data.last_name,
                data.email,
                data.photo_url, 
          ]
        );
        return result.rows[0]
    }

    static update = async(username, data) => {
        const { query, values } = sqlForPartialUpdate(
          "users",
          data,
          "username",
          username
        );

        const result = await db.query(query, values)
        const user = result.rows[0]

        if (!user) {
            throw new ExpressError("Company not found", 404);
        }
        return user
    }

    static delete = async(username) => {
        const result = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
            [username]
        )
        if (result.rows.length === 0) {
          throw new ExpressError("User not found", 404);
        }
        return result.rows[0];
    }
}

module.exports = User;