const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const { VerficationMailTemplateName } = require("../config/constant");
require("dotenv").config();

// Error logging function
const logErrorToFile = (error, context) => {
  const logMessage = `[${new Date().toISOString()}] [${context}] Error: ${error.stack || error}\n`;
  const logFilePath = path.join(__dirname, "../logs/error.log");

  // Ensure logs directory exists
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append error to file
  fs.appendFileSync(logFilePath, logMessage);
};

const SendOTPMail = async ({
  to,
  subject,
  content,
  buttonUrl,
  otp,
  templete_file = VerficationMailTemplateName,
}) => {
  try {
    // Validate environment variables
    let host = process.env.EMAIL_HOST || "mail.technocitynetworks.com.pk";
    let port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;
    let address =
      process.env.EMAIL_ADDRESS || "abdulrehman@technocitynetworks.com.pk";
    let password = process.env.EMAIL_PASSWORD || "RehFah236";

    if (!host || !port || !address || !password) {
      const error = new Error("Missing required environment variables");
      logErrorToFile(error, "sendEmail");
      throw error;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: address,
        pass: password,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("SMTP connection verified");

    // Render EJS template
    const templatePath = path.join(__dirname, "Template" ,templete_file + '.ejs');
    console.log("Rendering EJS template:", templatePath);
    const html = await ejs.renderFile(templatePath, {
      content: content || "No custom content provided",
      buttonUrl: buttonUrl || "#",
      otp: otp,
    });

    // Prepare email options
    const mailOptions = {
      from: `"TechnoCity Networks" <${address}>`,
      to: to,
      subject: subject || "TechnoCity Networks Email",
      html: html,
    };
    console.log("Email options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    // Send email
    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log error to file and console
    logErrorToFile(error, "sendEmail");
    console.error("Error sending email:", error);
    console.error("Error details:", {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  SendOTPMail,
};