process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../../app");
const getToken = require("../../helpers/token");

const { beforeEachHook, afterAllHook, TEST_DATA } = require("./jest.config");

beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
  // await addTestUser();
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
        const result = await request(app).get("/users/testUser");
        expect(result.statusCode).toBe(201);  
        expect(result.body.user.username).toEqual("testUser");    
    })
})

describe("POST, /users", () => {
    test("register user", async() => {
        const result = await request(app).post("/users").send({
          username: "testUser2",
          password: "testPassword2",
          first_name: "testFirstName2",
          last_name: "testLastName2",
          email: "testEmail2",
          photo_url: "testURL2",
        });

        expect(result.statusCode).toBe(200); 
        expect(result.body).toHaveProperty("token");    
    })
})

describe("PATCH /users/username", () => {
  test("update user data", async () => {
    const result = await request(app).patch("/users/testUser").send({
      first_name: "testFirstName2",
      last_name: "testLastName2",
      email: "updated",
      photo_url: "testURL2",
      token: TEST_DATA.userToken
    });

    console.log(result.body);

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
