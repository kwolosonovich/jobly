/** Start server for jobly. */

const app = require("./app");
// const { PORT } = require("./config");

app.listen(3000, function() {
  console.log(`Server starting on port 3000`);
});
