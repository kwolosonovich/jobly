const request = require("supertest");
const app = require("../../app");

const {beforeEachHook, afterAllHook, testCompany, testJob, afterEachHook}  = require("./jest.config") 


beforeEach(async() => {
    await beforeEachHook();
    await testCompany()
    await testJob();
});

describe("GET, /jobs", () => {
    test('get jobs', async() => {
        const result = await request(app)
        .get("/jobs")    
        expect(result.statusCode).toBe(200);
        expect(result.body.result[0]).toHaveProperty("title");
    })
});

// describe("GET /jobs/:id", () => {
//   test("get job by id", async () => {
//     const result = await request(app).get("jobs/999")
    
//     expect(result.statusCode).toBe(200)
//     expect(result.res.text).toContain('Job1');

//   });
// });

// describe("POST /jobs", () => {
//     test('add new job', async() => {
//         const result = await request(app).post("/jobs").send({
//           title: "job2",
//           salary: 2000,
//           equity: ".8",
//           company_handle: "c1",
//         });
//         expect(result.statusCode).toBe(200)
//         expect(result.body.job).toHaveProperty("title")
//     })
// });

// describe("PATCH /jobs/id", () => {
//     test('update job data', async() => {
//         const result = await request(app).patch(`/jobs/${testJob.id}`).send({
//           name: "Job1",
//           num_employees: 20,
//           description: "Job1 description",
//           logo_url: "job1Url",
//         });
//         expect(result.statusCode).toBe(200)
//         expect(result.body).toHaveProperty("updated");
//     })
// })

// describe("DELETE /jobs/id", () => {
//     test('delete job', async() => {
//         const result = await request(app).delete(`/jobs/${testJob.id}`);
//         expect(result.statusCode).toBe(200)
//         expect(result.text).toContain("Job deleted")
//     })
// })

afterEach(async() => {
    await afterEachHook()
})

afterAll(async() => {
  await afterAllHook();
});
