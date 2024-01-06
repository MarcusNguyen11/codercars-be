const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

carController.createCar = async (req, res, next) => {
  const carInfor = {
    make: req.body.make,
    model: req.body.model,
    release_date: req.body.release_date,
    transmission_type: req.body.transmission_type,
    size: req.body.size,
    style: req.body.style,
    price: req.body.price,
  };
  try {
    if (!carInfor) throw new AppError(402, "Bad Request", "Create Car Error");
    const create = await Car.create(carInfor);
    sendResponse(res, 200, true, { data: create }, null, "Create Car Success");
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  const filter = {};
  const { page, pageSize } = req.query;
  try {
    const query = Car.find(filter);
    const total = await Car.countDocuments(query);
    query.sort({ updatedAt: -1 });
    const skip = (page - 1) * pageSize;
    query.skip(skip).limit(pageSize);

    const list = await query.exec();

    sendResponse(
      res,
      200,
      true,
      { cars: list, total },
      null,
      "Found list of cars success!!!"
    );
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  const targetId = { _id: req.params.id };
  const updateInfor = {
    make: req.body.make,
    model: req.body.model,
    release_date: req.body.release_date,
    transmission_type: req.body.transmission_type,
    size: req.body.size,
    style: req.body.style,
    price: req.body.price,
  };
  const options = { new: true };
  try {
    const updated = await Car.findByIdAndUpdate(targetId, updateInfor, options);
    sendResponse(res, 200, true, { updated }, null, "Updated car success");
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  const targetId = { _id: req.params.id };
  const updateInfor = {
    isDeleted: true,
  };
  const options = { new: true };
  try {
    const deleted = await Car.findByIdAndUpdate(targetId, updateInfor, options);
    sendResponse(res, 200, true, { deleted }, null, "Deleted car success");
  } catch (err) {}
};

module.exports = carController;
