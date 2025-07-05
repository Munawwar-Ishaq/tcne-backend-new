const { Sequelize } = require("sequelize");
const { generateToken, KarachiDate } = require("../../config/helper");
const OtpModel = require("../../models/OtpModel");
const UserModel = require("../../models/UsersModel");

const VerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const karachiNow = KarachiDate();

    const otpRecord = await OtpModel.findOne({
      where: { email, otp },
    });

    console.log("OTP Record:", otpRecord);

    if (!otpRecord) {
      return res.status(401).json({ message: "Incorrect OTP" });
    }

    if (otpRecord.expiresAt < karachiNow) {
      return res.status(401).json({ message: "OTP expired" });
    }

    let token = generateToken(user._id);

    await OtpModel.destroy({
      where: { email: user.email },
    });

    return res
      .status(200)
      .json({
        message: "OTP verified successfully",
        token: token,
        user: user,
      });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = VerifyOtp;
