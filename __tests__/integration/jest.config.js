process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company");
const Job = require("../../models/job");

beforeEachHook = async() => {
    await db.query('DELETE FROM companies');
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
};

afterEachHook = async () => {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
};


afterAllHook = async() => {
    await db.end();
}


testCompany = async() => {
    const company1 = {
      handle: "c1",
      name: "Company1",
      num_employees: 10,
      description: "Company1 description",
      logo_url: "company1Url",
    };
    await Company.add(company1)
}

testJob = async() => {
    const job1 = {
        id: 999,
        title: "job1", 
        salary: 1000, 
        equity: 0.5,
        company_handle: "c1"
    } 
    // await Job.add(job1)

    await db.query(
      `INSERT INTO jobs (id, title, salary, equity, company_handle) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`
    [ job1.id, job1.title, job1.salary, job1.equity, job1.company_handle]
    );
}

module.exports = {
  beforeEachHook,
  afterEachHook,
  afterAllHook,
  testCompany,
  testJob
};
