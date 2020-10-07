const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

beforeEachHook = async() => {
    await db.query('DELETE FROM companies');
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
};

afterAllHook = async() => {
    await db.end();
}

module.exports = {
    beforeEachHook, 
    afterAllHook
}
