const fs = require('node:fs')

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err
    }
  })
}

module.exports = deleteFile
