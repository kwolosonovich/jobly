const request = require('supertest')
const app = require("../../app");

const {beforeEachHook, afterAllHook}  = require("./jest.config")

beforeEach(async function () {
    await beforeEachHook();
    await testCompanies()
});

// test GET all companies
describe("GET, /companies", () => {
    test('get companies', async() => {
        const result = await request(app)
        .get("/companies")    
        expect(result.statusCode).toBe(200);
        expect(result.body.companies[0]).toHaveProperty("handle");
        expect(result.body.companies.length).toBe(1)
    })
});

// test GET company by handle
describe("GET /companies/handle", () => {
  test("get handle", async () => {
    const result = await request(app).get("/companies/c1")
    console.log(result.res.text)
    expect(result.res.statusCode).toBe(201)
    expect(result.res.text).toContain('Company1');

  });
});

// test POST new company
describe("POST /companies", () => {
    test('add new company', async() => {
        const result = await request(app).post("/companies").send({
          handle: "newCompany",
          name: "Company",
          num_employees: 100,
          description: "Company description",
          logo_url: "companyUrl",
        });
        expect(result.statusCode).toBe(200)
        expect(result.body.company).toHaveProperty("handle")
    })
});

// test PATCH company update
describe("PATCH /companies/handle", () => {
    test('update company data', async() => {
        const result = await request(app).patch("/companies/c1").send({
          name: "Company1",
          num_employees: 20,
          description: "Company1 description",
          logo_url: "company1Url",
        });
        console.log(result.body)
        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty("updated");
    })
})

// test DELETE company
describe("DELETE /companies/handle", () => {
    test('delete company', async() => {
        const result = await request(app).delete("/companies/c1")
        console.log(result.body)
        expect(result.statusCode).toBe(200)
        expect(result.text).toContain("Company deleted")
    })
})


afterAll(async function () {
  await afterAllHook();
});