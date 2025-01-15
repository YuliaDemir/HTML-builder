const fs = require('fs');

const readStream = fs.createReadStream('01-read-file/text.txt', 'utf8');

readStream.on('data', (chunk) => {
    console.log(chunk);
});

readStream.on('error', (err) => {
    console.error('Ошибка при чтении файла:', err);
});