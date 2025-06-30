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
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
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
    indexes: [
      {
        unique: false,
        fields: ['name']
      }
    ]
  }
);


module.exports = RolesModel;