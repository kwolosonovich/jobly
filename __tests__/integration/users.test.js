process.env.NODE_ENV = "test";

// const request = require("supertest");
// const app = require("../../app");
// const ExpressError = require("../../helpers/expressError");

// const getToken = require("../../helpers/token");

// const {
//   beforeEachHook,
//   afterAllHook,
//   AUTH,
//   afterEachHook
// } = require("./jest.config");

// beforeEach(async function () {
//   await beforeEachHook(AUTH);
// });


const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../../app");
const db = require("../../db");
const {SECRET_KEY,
  BCRYPT_WORK_FACTOR
} = require("../../config")


// const User = require("../../models/user");
// const ExpressError = require("../../helpers/expressError");



// let AUTH = {
//   username: undefined,
//   token: undefined,
// };

let user;
let token;



beforeEach = async () => {

  try {
    let hashedPassword = await bcrypt.hash("secret", 1);

    await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
                    VALUES ('testUser', $1, 'testFrist', 'testLast', 'test@email.com', true) RETURNING username, is_admin`,
      [hashedPassword]
    );

    user = results.rows[0];
    token = jwt.sign(
      { username: user.username, is_admin: user.is_admin },
      SECRET_KEY
    );

    // await User.add({
    //   username: 'testUser',
    //   password: hashedPassword,
    //   first_name: 'testFirst',
    //   last_name: 'testLast',
    //   email: 'test@gmail.com',
    //   photo_url: 'testURL',
    //   is_admin: 'true'
    // });

    // const received = await request(app).post("/login").send({
    //   username: "testUser",
    //   password: "password",
    // });

    // console.log(received)

    // AUTH.token = received.body.token;
    // AUTH.username = jwt.decode(AUTH.token).username;

  } catch (error) {
    return error;
  }
};


afterEach(async () => {
  await db.query(`DELETE FROM users`);
});


describe("GET, /users", () => {
  test("get users", async () => {
    const received = await request(app).get('/users');
=    expect(received.statusCode).toBe(200);
    expect(received.body.users[0]).toHaveProperty("username");
  });
});

describe("GET, /users/:username", () => {
  test("get username", async () => {
    const received = await request(app).get("/users/testUser");
    expect(received.statusCode).toBe(201);
    expect(received.body.user.username).toEqual("testUser");
  });
});

// describe("POST, /users", () => {
//   test("register user", async () => {
//     const received = await request(app).post("/users").send({
//       username: "testUser2",
//       password: "testPassword2",
//       first_name: "testFirstName2",
//       last_name: "testLastName2",
//       email: "testEmail2",
//       photo_url: "testURL2",
//     });

//     expect(received.statusCode).toBe(200);
//     expect(received.body).toHaveProperty("token");
//   });
// });

// describe("PATCH /users/username", () => {
//   test("update user data", async () => {
//     const received= await request(app).patch("/users/testUser").send({
//       first_name: "testFirstName2",
//       last_name: "testLastName2",
//       email: "updated",
//       photo_url: "testURL2",
//       token: DATA.token,
//     });

//     expect(result.statusCode).toBe(200);
//     expect(result.body).toHaveProperty("updated");
//   });
// });

// describe("DELETE /users/username", () => {
//   test("delete user", async () => {
//     const received= await request(app).delete("/users/testUserName");
//     expect(result.statusCode).toBe(200);
//     expect(result.text).toContain("User deleted");
//   });
// });

// afterEachHook 

// afterAll(async function () {
//   await afterAllHook();
//   await db.end();
// });

// afterEach(async function () {
//   try {
//     await db.query("DELETE FROM users");
//   } catch (error) {
//     console.error(error);
//   }
// });

afterAll(async function () {
    try {
      await db.end();
    } catch (err) {
      console.error(err);
    }
});


// async function afterEachHook() {
//   try {
//     await db.query("DELETE FROM jobs");
//     await db.query("DELETE FROM users");
//     await db.query("DELETE FROM companies");
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function afterAllHook() {
//   try {
//     await db.end();
//   } catch (err) {
//     console.error(err);
//   }
// }

