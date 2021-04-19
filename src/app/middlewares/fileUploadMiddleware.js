const multer = require('multer');
const _ = require('lodash');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = (options) => {
  if (_.isEmpty(options)) {
    return multer({storage});
  }
  return multer(options);
};

module.exports = {
  upload
};