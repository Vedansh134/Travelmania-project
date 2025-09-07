const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});
// these are bydefault name == cloud_name,api_key,api_secret

// create cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'travelmania_DEV', // we define folder name in cloudinary for storage
      //format: async (req, file) => 'png', // supports promises as well
      allowedFormats : ["png","jpg","jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage
};