const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

module.exports.generateToken = (data) => {
    return jwt.sign({ data }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
}

module.exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log("Decode Error", err);
            return null;
        }
        return decoded;
    });
}

module.exports.KarachiDate = () => {
    const date = new Date();
    const KarachiTime = date.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
    });
    const karachiDate = new Date(KarachiTime);
    return karachiDate;
};