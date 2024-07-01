import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import getFilterWithIdOwner from "../helpers/getFilterWithIdOwner.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const filter = {
      owner,
    };
    const result = await contactsServices.listContacts(filter);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const filter = getFilterWithIdOwner(req);
    const result = await contactsServices.getContactById(filter);

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
    const filter = getFilterWithIdOwner(req);
    const result = await contactsServices.deleteContact(filter);
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

    const { _id: owner } = req.user;

    const result = await contactsServices.addContact({ ...req.body, owner });
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
    const filter = getFilterWithIdOwner(req);
    const result = await contactsServices.updateContactById(filter, req.body);
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
    const filter = getFilterWithIdOwner(req);
    const data = await contactsServices.updateFavoriteStatus(filter, req.body);
    if (!data) {
      throw HttpError(404, "Not found");
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};
