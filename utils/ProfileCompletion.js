module.exports = function calculateProfileCompletion(user) {
  const fields = [
    user.username,
    user.email,
    user.mobile,
    user.profile.profile_image,
    user.profile.banner_image,
    user.profile.bio,
    user.profile.address,
    user.profile.city,
    user.profile.state,
    user.profile.country,
    user.profile.pincode,
  ];

  const filledFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== ""
  ).length;

  return Math.round((filledFields / fields.length) * 100);
};