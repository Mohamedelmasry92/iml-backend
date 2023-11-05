
const fs = require('fs');
const path = require('path');

function deletePhoto(folderPath, photoFilename) {
  const photoPath = path.join(folderPath, photoFilename);
  const status = {};

  if (fs.existsSync(photoPath)) {
    try {
      fs.unlinkSync(photoPath);
      status.success = true;
      status.message = 'Photo deleted successfully';
    } catch (err) {
      status.success = false;
      status.message = err.message;
    }
  } else {
    status.success = false;
    status.message = 'File does not exist';
  }

  return status;
}

module.exports = deletePhoto;
