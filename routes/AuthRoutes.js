const express = require("express");
const CreateAccount = require("../controller/auth/CreateAccount");
const Login = require("../controller/auth/Login");
const VerifyOtp = require("../controller/auth/VerifyOtp");
const ResendOtp = require("../controller/auth/ResendOtp");
const router = express.Router();
const multer = require("multer");
const CreateRole = require("../controller/auth/CreateRole");
const OperatorProfile = require("../controller/operator/OperatorProfile");
const auth = require("../middleware/auth");

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/"); // Uploads folder mein files save hongi
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `profile-${uniqueSuffix}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

router.post("/login", Login);
router.post("/verify-otp", VerifyOtp);
router.post("/resend-otp", ResendOtp);
router.post("/create-account", upload.single("image"), CreateAccount);
router.post("/create-role", auth, CreateRole);
router.get("/operator-profile", auth, OperatorProfile);

module.exports = router;
