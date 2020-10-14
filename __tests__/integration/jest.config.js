process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company");
const Job = require("../../models/job");
const User = require("../../models/user");

beforeEachHook = async() => {
    await db.query('DELETE FROM companies');
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
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
    await User.add({
      username: "testUserName",
      password: "testPassword",
      first_name: "testFirstName",
      last_name: "testLastName",
      email: "testEmail",
      photo_url: "testURL"
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
