// @desc   Get logged-in user
// @route  GET /api/users/me
exports.getMe = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
};
