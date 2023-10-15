const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //EXECUTE QUERY
    const docs = await features.query; // .explain();
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

exports.getOne = (model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    const query = model.findById(req.params.id);
    if (populateOpt) {
      query.populate(populateOpt);
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError('error: no document found with this id ', 404));
    }
    res.status(201).json({ status: 'success', data: doc });
  });
exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('error: no document found with that id ', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('error: no document found with this id ', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });
exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
  });
