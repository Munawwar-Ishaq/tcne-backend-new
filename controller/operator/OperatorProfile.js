const UserModel = require("../../models/UsersModel");

const OperatorProfile = async (req, res) => {
  const id = req.headers["userData"];
  try {
    const user = await UserModel.findOne({ where: { _id: id } });
    console.log("user", user);
    res.json({ message: "Welcome to TechnoCity Billing Backend!", user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = OperatorProfile;
