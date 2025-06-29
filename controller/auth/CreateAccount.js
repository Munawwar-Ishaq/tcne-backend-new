const UserModel = require("../../models/UsersModel");
const bcryptjs = require("bcryptjs");


const CreateAccount = async (req, res) => {
  const { name, email, password , roleId } = req.body;
  let profilePicture = req?.file?.filename;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypt Password
    const salt = await bcryptjs.genSalt(10);
    const encryptedPassword = await bcryptjs.hash(password, salt);

    const user = await UserModel.create({
      name,
      email,
      password : encryptedPassword,
      roleId : roleId,
      profilePicture : profilePicture || null,
    });

    return res.status(201).json({ message: "User created successfully", user });

  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = CreateAccount;
