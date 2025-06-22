const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  hospitalName: String,
  logoUrl: String,
  address: String,
  contactEmail: String,
  departments: [String]
});

module.exports = mongoose.model('Config', configSchema);
