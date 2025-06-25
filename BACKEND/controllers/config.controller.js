const Config = require('../models/Config');

exports.getHospitalConfig = async (req, res) => {
  const config = await Config.findOne();
  res.json(config);
};

exports.updateHospitalConfig = async (req, res) => {
  const updated = await Config.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(updated);
};
