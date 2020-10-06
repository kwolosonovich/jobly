/** Database setup for jobly. */

const { Client } = require("pg");
const { data } = require("./config");

const client = new Client(data);

client.connect();

module.exports = client;