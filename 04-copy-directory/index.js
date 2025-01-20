const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

async function copyDirectory(src, dest) {
    try {
        await fsPromises.mkdir(dest, { recursive: true });

        const entries = await fsPromises.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await copyDirectory(srcPath, destPath);
            } else {
                const [srcStat, destStat] = await Promise.allSettled([
                    fsPromises.stat(srcPath),
                    fsPromises.stat(destPath),
                ]);
                if (
                    srcStat.status === "fulfilled" &&
                    (destStat.status === "rejected" ||
                        srcStat.value.mtimeMs > destStat.value.mtimeMs)
                ) {
                    await fsPromises.copyFile(srcPath, destPath);
                }
            }
        }

        const destEntries = await fsPromises.readdir(dest, { withFileTypes: true });
        for (const destEntry of destEntries) {
            const srcPath = path.join(src, destEntry.name);
            const destPath = path.join(dest, destEntry.name);

            if (!(await fsPromises.stat(srcPath).catch(() => null))) {
                await fsPromises.rm(destPath, { recursive: true, force: true });
            }
        }
    } catch (error) {
        console.error(`Error copying directory: ${error.message}`);
    }
}

(async () => {
    const srcFolder = path.join(__dirname, 'files');
    const destFolder = path.join(__dirname, 'files-copy');

    await copyDirectory(srcFolder, destFolder);
    console.log('Directory copied successfully.');
})();
