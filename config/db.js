const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://janmejayazala:janmejayzala@cluster0.kxf1bie.mongodb.net/node-final?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("database connected");
  } catch (err) {
    console.log("error =>", err);
  }
};
module.exports = connection;
