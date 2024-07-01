import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import * as userServices from "../services/userServices.js";
import { createToken } from "../helpers/jwt.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userServices.signup({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
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
