const mongoose = require("mongoose");

const connection = async () => {
  await mongoose.connect(
    "mongodb+srv://janmejayazala:Janmejay@2005@todo-final.yngjmzq.mongodb.net/node-final?retryWrites=true&w=majority&appName=todo-final"
  );
  console.log("database connected");
};
module.exports = connection;
