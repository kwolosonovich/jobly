const request = require("supertest");
const app = require("../../app");

const { beforeEachHook, afterAllHook, testUser } = require("./jest.config");

beforeEach(async function () {
  await beforeEachHook();
  await testUser();
});

describe("GET, /users", () => {
    test("get users", async() => {
        const result = await request(app).get("/users")
        expect(result.statusCode).toBe(200)
        expect(result.body.users[0]).toHaveProperty("username");
    })
})

describe("GET, /users/:username", () => {
    test("get username", async() => {
        const result = await request(app).get("/users/testUserName");
        expect(result.statusCode).toBe(201);  
        expect(result.body.user.username).toEqual("testUserName");    
    })
})

describe("POST, /users", () => {
    test("add user", async() => {
        const result = await request(app).post("/users").send({
          username: "testUser2",
          password: "testPassword2",
          first_name: "testFirstName2",
          last_name: "testLastName2",
          email: "testEmail2",
          photo_url: "testURL2",
        });
        expect(result.statusCode).toBe(200); 
        expect(result.body.user.username).toEqual("testUser2");    
    })
})

describe("PATCH /users/username", () => {
  test("update user data", async () => {
    const result = await request(app).patch("/users/testUserName").send({
      username: "updatedUserName",
      first_name: "testFirstName2",
      last_name: "testLastName2",
      email: "testEmail2",
      photo_url: "testURL2",
    });
    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("updated");
  });
});

describe("DELETE /users/username", () => {
    test('delete user', async() => {
        const result = await request(app).delete("/users/testUserName");
        expect(result.statusCode).toBe(200)
        expect(result.text).toContain("User deleted")
    })
})


afterAll(async function () {
  await afterAllHook();
});
