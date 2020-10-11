require("dotenv").config();

let data;

if (process.env.NODE_ENV === "test") {
  data = "jobly-test";
} else {
  data = "jobly";
}

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  data,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};
