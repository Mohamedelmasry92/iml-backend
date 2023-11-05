
const fs = require('fs');
const path = require('path');

function deletePhotos(folderPath, photosToDelete) {
  const status = {};

  photosToDelete.forEach((photoFilename) => {
    const photoPath = path.join(folderPath, photoFilename);

    if (fs.existsSync(photoPath)) {
      try {
        fs.unlinkSync(photoPath);
        status[photoFilename] = { success: true, message: 'Deleted successfully' };
      } catch (err) {
        status[photoFilename] = { success: false, message: err.message };
      }
    } else {
      status[photoFilename] = { success: false, message: 'File does not exist' };
    }
  });

  return status;
}

module.exports = deletePhotos;
