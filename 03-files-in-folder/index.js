const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

function displayFileDetails() {
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading the directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.isFile()) {
                const filePath = path.join(folderPath, file.name);
                
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error getting stats for file ${file.name}:`, err);
                        return;
                    }

                    const fileName = path.parse(file.name).name;
                    const fileExtension = path.parse(file.name).ext.slice(1); // Remove the dot
                    const fileSizeKb = (stats.size / 1024).toFixed(3); // Convert size to KB

                    console.log(`${fileName} - ${fileExtension} - ${fileSizeKb}kb`);
                });
            }
        });
    });
}

displayFileDetails();
