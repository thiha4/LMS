import User from "../models/userModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
// import { sendVerificationCode } from "../utils/sendVerificationCode.js";
// import sendEmail from "../utils/sendEmail.js";
import { resetPasswordEmailTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

const sendToken = (user, statusCode, res, message = "Logged in") => {
  const token = user.getJwtToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: "none"
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, message, token });
};

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return next(new ErrorHandler("Please provide name, email, and password", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User already exists", 400));

  user = await User.create({ name, email, password });
  await user.save();

  res.status(201).json({ success: true, message: "Registered successfully" });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler("Please enter email & password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid email or password", 401));
  // if (!user.isVerified) return next(new ErrorHandler("Please verify your account first", 403));

  sendToken(user, 200, res, "Login successful");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.json({ success: true, message: "Logged out" });
});

export const getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, resetUrl } = req.body; // frontend can pass a base reset URL
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // create token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const link = `${resetUrl || process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = resetPasswordEmailTemplate(link);

  // try {
  //   await sendEmail({ email: user.email, subject: "Password Reset", message });
  //   res.json({ success: true, message: "Email sent for password reset" });
  // } catch (err) {
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;
  //   await user.save();
  //   return next(new ErrorHandler("Email could not be sent", 500));
  // }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const cryptoToken = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(cryptoToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return next(new ErrorHandler("Reset token is invalid or has expired", 400));

  const { password } = req.body;
  if (!password || password.length < 6) return next(new ErrorHandler("Password must be at least 6 characters", 400));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res, "Password reset successful");
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { oldPassword, newPassword } = req.body;
  if (!await user.comparePassword(oldPassword)) return next(new ErrorHandler("Old password is incorrect", 400));
  if (!newPassword || newPassword.length < 6) return next(new ErrorHandler("New password must be at least 6 chars", 400));
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
});
