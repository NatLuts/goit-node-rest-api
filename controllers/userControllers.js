import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import * as userServices from "../services/userServices.js";
import { createToken } from "../helpers/jwt.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const avatarDir = path.resolve("public", "avatars");
const { BASE_URL } = process.env;

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await userServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar.url(email),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

export const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found or already verified");
  }

  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );

  res.json({
    message: "Email verify success",
  });
};

export const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verified email send successfully",
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };
  const token = createToken(payload);
  await userServices.updateUser({ _id: id }, { token });
  res.json({
    token,
  });
};

export const getCurrent = (req, res) => {
  const { username, email } = req.user;

  res,
    json({
      username,
      email,
    });
};

export const signout = async (req, res) => {
  const { _id } = req.user;
  await userServices.updateUser({ _id }, { token: " " });

  res.json({
    message: "Logout success",
  });
};

export const updateAvatar = async (req, res) => {
  const { _id } = req.body;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarDir, filename);

  Jimp.read(oldPath, (error, avatar) => {
    if (error) throw error;
    avatar.resize(250, 250).write(newPath);
  });

  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await userServices.updateAvatar(_id, avatarURL);
  res.json({ avatarURL });
};
