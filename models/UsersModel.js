const { DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/DB_Connection');
const RolesModel = require('./RolesModel');

const UserModel = sequelize.define('User', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // Auto-generate UUID
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deviceInfo: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isLogged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Roles',
      key: '_id',
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
});

UserModel.belongsTo(RolesModel, { foreignKey: 'roleId', as: 'role' });


module.exports = UserModel;