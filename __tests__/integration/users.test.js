process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../db");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../../config");
const User = require('../../models/user')


let AUTH = {
  username: undefined,
  token: undefined,
};

beforeEach (async () => {
  db.query(
    `DELETE FROM users`
  )

  try {
    let hashedPassword = await bcrypt.hash("secret", 1);

    let results = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
      VALUES ('testUser', $1, 'testFrist', 'testLast', 'test@email.com', true) RETURNING username, is_admin`,
      [hashedPassword]
    );

    let user = results.rows[0];
    let token = jwt.sign(
      { username: user.username, is_admin: user.is_admin },
      SECRET_KEY
    );

    AUTH.token = token
    AUTH.user = user.username


  } catch (error) {
    return error;
  }
});

afterEach(async () => {
  await db.query(`DELETE FROM users`);
});

describe("GET, /users", () => {
  test("get users", async () => {
    const received = await request(app).get('/users');
    expect(received.statusCode).toBe(200);
    expect(received.body.users[0]).toHaveProperty("username");
  });
});

describe("GET, /users/:username", () => {
  test("get username", async () => {
    const received = await request(app).get(`/users/${AUTH.user}`);
    expect(received.statusCode).toBe(201);
    expect(received.body.user.username).toEqual("testUser");
  });
});

describe("POST, /users", () => {
  test("register user", async () => {
    const received = await request(app).post("/users").send({
      username: "testUser2",
      password: "testPassword2",
      first_name: "testFirstName2",
      last_name: "testLastName2",
      email: "testEmail2",
      photo_url: "testURL2",
    });

    expect(received.statusCode).toBe(200);
    expect(received.body).toHaveProperty("token");
  });
});

describe("PATCH /users/:username", () => {
  test("update user data", async () => {
    const received = await request(app)
      .patch(`/users/${AUTH.user}`)
      .send({
        first_name: "update",
        last_name: "update",
        email: "update",
        photo_url: "update",
        token: `${AUTH.token}`,
      });

    //debugger

    console.log(received.body)

    let update = request.first_name
    let password = request.password

    expect(received.statusCode).toBe(200);
    expect(received.body).toHaveProperty("testFirstName2");
  });
});

describe("DELETE /users/username", () => {
  test("delete user", async () => {
    const received = await request(app).delete(`/users/${AUTH.user}`);
    expect(received.statusCode).toBe(200);
    expect(received.text).toContain("User deleted");
  });
});

afterEach(async function () {
  try {
    await db.query("DELETE FROM users");
  } catch (error) {
    console.error(error);
  }
});