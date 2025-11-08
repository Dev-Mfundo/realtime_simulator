const path = require("path");
const fs = require("fs");

const listDir = () => {
  const dirPath = path.join(__dirname, "../history_data");
  const listDirectories = fs.readdirSync(dirPath, { withFileTypes: true });
  const invalid = listDirectories.find((dirent) => !dirent.isDirectory());
  if (invalid) {
    throw new Error(`Non-directory entry found: ${invalid.name}`);
  }

  return listDirectories.map((dirent) => dirent.name);
};

module.exports = { listDir };
