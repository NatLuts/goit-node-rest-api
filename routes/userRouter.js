import express from "express";
import {
  signin,
  signup,
  getCurrent,
  signout,
} from "../controllers/userControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import { authSigninSchema, authSignupSchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const userRouter = express.Router();

userRouter.post("/signup", isEmptyBody, validateBody(authSignupSchema), signup);

userRouter.post("/signin", isEmptyBody, validateBody(authSigninSchema), signin);

userRouter.get("/current", authenticate, getCurrent);

userRouter.post("/signout", authenticate, signout);

export default userRouter;
