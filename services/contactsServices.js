import Contact from "../models/Contact.js";

export function listContacts(params = {}) {
  const { filter, fields, settings } = params;
  return Contact.find(filter, fields, settings);
}

export function getContactById(filter) {
  return Contact.findOne(filter);
}

export function removeContact(filter) {
  return Contact.findByIdAndDelete(filter);
}

export function addContact(data) {
  return Contact.create(data);
}

export function updateContactById(filter, data) {
  return Contact.findOneAndUpdate(filter, data);
}

export function updateFavoriteStatus(filter, data) {
  return Contact.findByIdAndUpdate(filter, data);
}
