const request = require("supertest");
const app = require("../../app");

beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
});

// tests

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});
