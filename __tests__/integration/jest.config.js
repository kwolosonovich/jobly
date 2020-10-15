process.env.NODE_ENV = "test";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/company");
const Job = require("../../models/job");
const User = require("../../models/user");

const TEST_DATA = {};

beforeEachHook = async(TEST_DATA) => {
    await db.query('DELETE FROM companies');
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");

    try {
      const hashedPassword = await bcrypt.hash("secret", 1);

      let testUser = await db.query(
        `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
                    VALUES ('testUser', $1, 'testFrist', 'testLast', 'test@email.com', true) RETURNING username, is_admin`,
        [hashedPassword]
      );

      const response = await request(app).post("/login").send({
        username: "testUser",
        password: "password",
      });

      TEST_DATA.userToken = response.body.token;
      TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;

    } catch (error) {
      return (error);
    }

    await Company.add({
      handle: "c1",
      name: "Company1",
      num_employees: 10,
      description: "Company1 description",
      logo_url: "company1Url",
    });
    await Job.add({
        id: 999,
        title: "job1", 
        salary: 1000, 
        equity: 0.5,
        company_handle: "c1"
    })
}
    
afterEachHook = async () => {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
};

afterAllHook = async() => {
    await db.end();
}

module.exports = {
  beforeEachHook,
  afterEachHook,
  afterAllHook,
  verbose: true
};
