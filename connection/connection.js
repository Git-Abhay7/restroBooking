const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/restroDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .once("open", () => {
    console.log("Database created successfully");
  })
  .on("error", (error) => {
    console.log("Error occured.");
  });