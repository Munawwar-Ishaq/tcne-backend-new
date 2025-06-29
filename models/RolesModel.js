const { DataTypes, Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/DB_Connection");

const RolesModel = sequelize.define(
  "Role",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    access: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        all: true,
      },
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

// Sync model with database
(async () => {
  await RolesModel.sync({ alter: true });
})();

module.exports = RolesModel;
