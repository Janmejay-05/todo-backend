const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
  } catch (err) {
    console.log("error =>", err);
  }
};
module.exports = connection;
