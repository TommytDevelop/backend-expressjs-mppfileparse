var fs = require("fs");

const regex = (pattern) => new RegExp(`.*${pattern}.*`);

const getListDirectory = async function listDirectories(pth) {
  const directories = (await fs.promises.readdir(pth, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dir) => dir.name);

  return directories;
};
const getListFiles = async function listFiles(pth) {
  const files = (await fs.promises.readdir(pth, { withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .map((dir) => dir.name);

  return files;
};
module.exports = { getListDirectory, getListFiles, regex };
