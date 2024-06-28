import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsServices.listContacts();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById({ _id: id });

    if (!result) {
      throw HttpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.deleteContact({ _id: id });
    if (!result) {
      throw HttpError(400);
    }
    res.json({
      message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contactsServices.addContact(req.body);
    req.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400);
    }
    const { id } = req.params;
    const result = await contactsServices.updateContactById(
      { _id: id },
      req.body
    );
    if (!result) {
      throw HttpError(400);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsServices.updateFavoriteStatus(
      { _id: id },
      req.body
    );
    if (!data) {
      throw HttpError(404, "Not found");
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};
