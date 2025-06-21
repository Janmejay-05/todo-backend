const express = require("express");
const connection = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const Auth = require("./middleware/auth");
const app = express();
const port = 8081;
const cors = require("cors");
const userModel = require("./model/userModel");
const todoRoutes = require("./routes/todoRoutes");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.get("/userdata", Auth, async (req, res) => {
  try {
    const data = JSON.parse(req.headers.user);

    const userData = await userModel.aggregate([
      { $match: { email: data.email } },
      { $project: { _id: 1, email: 1, todolist: 1, userName: 1 } },
    ]);

    res.status(200).json({ message: "userpage", userData });
  } catch (err) {
    res.status(400).json({ message: "error" });
  }
});

app.use("/api/todo", todoRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log("Server is not running");
    return;
  }
  connection();
  console.log("server is running");
});
