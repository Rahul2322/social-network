const app = require("./app");

const db = require("./config/database");

db();

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
