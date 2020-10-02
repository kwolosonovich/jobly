/** Database setup for jobly. */

// const { Client } = require("pg");
// const { DB_URI } = require("./config");

// const db = new Client({
//   connectionString: DB_URI
// });

// db.connect();

// module.exports = db;



// new

const { Client } = require("pg");
const { data } = require("./config");

const client = new Client(data);

client.connect();

module.exports = client;