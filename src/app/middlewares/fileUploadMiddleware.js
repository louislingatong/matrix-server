const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = (options) => {
  return multer({
    storage,
    ...options
  });
};

module.exports = {
  upload
};