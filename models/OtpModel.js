const { DataTypes, Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/DB_Connection");
const cron = require("node-cron");

const OtpModel = sequelize.define(
  "Otp",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
    timestamps: true,
  }
);

(async () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      await OtpModel.destroy({
        where: {
          expiresAt: { [Sequelize.Op.lt]: now },
        },
      });
      console.log("Expired OTPs cleaned at:", now);
    } catch (error) {
      console.error("Error cleaning expired OTPs:", error);
    }
  });
})();

module.exports = OtpModel;
