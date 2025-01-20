const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

function mergeStyles() {
  fs.readdir(stylesFolder, (err, files) => {
    if (err) {
      return console.error(`Error reading styles folder: ${err.message}`);
    }

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const writableStream = fs.createWriteStream(outputFile);

    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesFolder, file);
      const readableStream = fs.createReadStream(filePath, 'utf8');

      readableStream.on('data', chunk => {
        writableStream.write(chunk);
      });

      readableStream.on('end', () => {
        if (index < cssFiles.length - 1) {
          writableStream.write('\n');
        }
      });

      readableStream.on('error', error => {
        console.error(`Error reading file ${file}: ${error.message}`);
      });
    });

    writableStream.on('finish', () => {
      console.log('Styles have been successfully merged into bundle.css');
    });

    writableStream.on('error', error => {
      console.error(`Error writing to bundle.css: ${error.message}`);
    });
  });
}

mergeStyles();
