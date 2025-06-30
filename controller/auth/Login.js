const { OTP_EXPIRY_TIME, VerficationMailTemplateName } = require("../../config/constant");
const { generateOTP, KarachiDate } = require("../../config/helper"); // Make sure KarachiDate is exported as a function now
const { SendOTPMail } = require("../../Email/SendOTPMail");
const OtpModel = require("../../models/OtpModel");
const UserModel = require("../../models/UsersModel");
const bcryptjs = require("bcryptjs");
const { Sequelize } = require("sequelize"); // Import Sequelize to use Op.gt for checking expiry

const Login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ where: { name } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Get current Karachi time
        const karachiNow = KarachiDate();

        // 1. Delete any existing unexpired OTPs for this user's email
        //    (Or, if you want to allow multiple unexpired OTPs, skip this step.
        //    However, for a typical "send new OTP" flow, you'd invalidate old ones.)
        await OtpModel.destroy({
            where: {
                email: user.email,
                expiresAt: { [Sequelize.Op.gt]: karachiNow }, // Only delete if not yet expired
            },
        });

        let otp = generateOTP();

        // Calculate expiration time based on Karachi date
        const expiresAt = new Date(karachiNow.getTime() + OTP_EXPIRY_TIME);

        await OtpModel.create({
            email: user.email,
            otp: otp,
            expiresAt: expiresAt,
        });

        SendOTPMail({
            to: user.email,
            subject: "TechnoCity Networks - Email Verification",
            otp: otp,
            templete_file : VerficationMailTemplateName,
        });

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        // It's good practice to log the error for debugging, then send a generic message
        console.error("Login error:", error); // Use console.error for errors
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = Login;