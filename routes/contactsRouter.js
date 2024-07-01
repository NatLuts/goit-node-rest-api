import express, { application } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { isValidId } from "../middlewares/isValidId.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", isValidId, isEmptyBody, updateContact);

contactsRouter.patch(
  "/:id/favorite",

  updateStatusContact
);

export default contactsRouter;
