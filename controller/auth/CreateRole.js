const RolesModel = require("../../models/RolesModel");

const CreateRole = async (req, res) => {
  const { name, access } = req.body;

  try {
    let findRole = await RolesModel.findOne({
      where: {
        name,
      },
    });

    if (findRole) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    const role = await RolesModel.create({
      name,
      access : access || { all : true },
    });

    return res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = CreateRole;
