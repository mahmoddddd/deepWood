const Settings = require('../models/Settings');
const { asyncHandler } = require('../middlewares/errorMiddleware');

// @desc    Get store settings
// @route   GET /api/settings
exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  res.status(200).json({ success: true, data: settings });
});

// @desc    Update store settings
// @route   PUT /api/settings
exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({ success: true, data: settings });
});
