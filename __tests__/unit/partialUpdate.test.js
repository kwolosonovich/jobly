// const sqlForPartialUpdate = require("../../helpers/partialUpdate");

// describe("partialUpdate", () => {
//   it("should generate proper partial update query with 1 field", function () {
//     const { query, values } = sqlForPartialUpdate(
//       "jobs",
//       { title: "New job title" },
//       "id",
//       1
//     );

//     expect(query).toEqual(
//       "UPDATE jobs SET title=$1 WHERE id=$2 RETURNING *"
//     );

//     expect(values).toEqual(["New job title", 1]);
//   });
// });
