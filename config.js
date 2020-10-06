require("dotenv").config();

let data;

if (process.env.NODE_ENV === "test") {
  data = "jobly-test";
} else {
  data = "jobly";
}

const SECRET_KEY = process.env.SECRET_KEY || "secret";

module.exports = {
  data,
  SECRET_KEY
};
