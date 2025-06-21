const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  const token = req.headers.authorization;
  const data = JSON.parse(req.headers.user);

  try {
    console.log("body", data);
    // console.log("token", token.split(" ")[1]);
    if (!token) {
      return res.status(400).json({ message: "unauthorize" });
    }

    const result = jwt.verify(token.split(" ")[1], "jay");
    console.log("result", result.isAcc);

    const { email, password } = result.isAcc;

    if (email !== data.email) {
      return res.status(400).json({ message: "wrong email" });
    }

    const passwordCheck = await bcrypt.compare(data.password, password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "wrong password" });
    }
    next();
  } catch (err) {
    res.status(400).json({ message: "error" });
  }
};

module.exports = Auth;
