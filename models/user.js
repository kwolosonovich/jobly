const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config")

class User {

  // register new user

  static register = async (user) => {

    let hashedPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
    const result = await db.query(  // add user to db 
      `INSERT INTO users (username, password, first_name, last_name, email, photo_url, is_admin)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING username, is_admin`,
    [
        user.username,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.email,
        user.photo_url,
        user.is_admin
      ]
    );
    return result.rows[0]; // return username and is_admin
}

  // validate username and password return true/false

  static validatePassword = async (username, inputPassword) => {
    const result = await db.query(
      `SELECT * FROM users 
        WHERE username = $1`,
      [username]
    );
    let dbPassword = result.rows[0];
    // check if password is found
    if (!dbPassword) throw new ExpressError("Invalid password", 401);
    // verify password
    let verified = await bcrypt.compare(inputPassword, dbPassword.password); 
    if (verified) {
        return result 
    }
    else {
        throw new ExpressError("Invalid Password", 401);
    }
  };

  // login timestamp

  static async updateLoginTimestamp(username) {
    let result = await db.query(
      `UPDATE users
        SET last_login_at = current_timestamp
        WHERE username = $1`,
      [username]
    );
    return result;
  }

  // get all users

  static getAll = async () => {
    const result = await db.query(
      `SELECT username, first_name, last_name 
            FROM users`
    );
    return result.rows;
  };

  // get user by username

  static getUser = async (username) => {
    const result = await db.query(
      `SELECT username, first_name, last_name, emairesultl, photo_url
            FROM users
            WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      throw new ExpressError("Match not found", 404);
    }
    return user;
  };

  // update user

  static update = async (username, userData) => {

    const { query, values } = sqlForPartialUpdate(
      "users",
      userData,
      "username",
      username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError("User not found", 404);
    }
    return user;
  };

  // delete user

  static delete = async (username) => {
    const result = await db.query(
      `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
      [username]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("User not found", 404);
    }
    return result.rows[0];
  };
}

module.exports = User;