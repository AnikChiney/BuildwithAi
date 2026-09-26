const fs = require("fs/promises");

const deleteMediaFile = async (filePath) => {
    if (!filePath) return;

    await fs.unlink(filePath).catch(() => {});
};

module.exports = {
    deleteMediaFile,
};