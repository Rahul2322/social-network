const mongoose = require("mongoose");

const db = () => {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Connections are Successfull");
  });

  connection.on("error", () => {
    console.log("Something went wrong");
  });
};

module.exports = db;
