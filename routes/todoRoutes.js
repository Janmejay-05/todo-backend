const express = require("express");
const userModel = require("../model/userModel");
const todoRoutes = express.Router();

todoRoutes.post("/addtodo", async (req, res) => {
  console.log(req.body);
  try {
    await userModel.updateOne(
      { email: req.body.email },
      { $set: { todolist: req.body.usertodo } }
    );
    return res.status(200).json({ message: "successful" });
  } catch (err) {
    res.json({ message: "error" });
  }
});

module.exports = todoRoutes;
