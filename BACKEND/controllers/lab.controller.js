const LabResult = require('../models/LabResult');

exports.uploadLabResult = async (req, res) => {
  const { patientId, testName, result, documentUrl } = req.body;
  const labResult = await LabResult.create({
    patientId,
    testName,
    result,
    documentUrl,
    uploadedBy: req.user._id
  });
  res.status(201).json(labResult);
};

exports.getLabResultsForPatient = async (req, res) => {
  const labResults = await LabResult.find({ patientId: req.params.id });
  res.json(labResults);
};
