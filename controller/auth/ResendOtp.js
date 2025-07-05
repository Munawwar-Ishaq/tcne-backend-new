const { generateOTP, KarachiDate, OTP_EXPIRY_TIME, VerficationMailTemplateName } = require("../../config/helper");
const { SendOTPMail } = require("../../Email/SendOTPMail");
const OtpModel = require("../../models/OtpModel");
const UserModel = require("../../models/UsersModel");
const bcryptjs = require("bcryptjs");
const { Sequelize } = require("sequelize");

const ResendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const karachiNow = KarachiDate();

        await OtpModel.destroy({
            where: {
                email: user.email,
                expiresAt: { [Sequelize.Op.gt]: karachiNow },
            },
        });

        let otp = generateOTP();

        const expiresAt = new Date(karachiNow.getTime() + OTP_EXPIRY_TIME);

        await OtpModel.create({
            email: user.email,
            otp: otp,
            expiresAt: expiresAt,
        });

        await SendOTPMail({
            to: user.email,
            subject: "TechnoCity Networks - Email Verification",
            otp: otp,
            templete_file : VerficationMailTemplateName,
        });

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        // It's good practice to log the error for debugging, then send a generic message
        console.error("Resend OTP error:", error); // Use console.error for errors
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = ResendOtp;