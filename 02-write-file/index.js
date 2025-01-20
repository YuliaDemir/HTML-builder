const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptMessage = 'Enter some text (type "exit" or press "ctrl + c" to quit): ';

console.log('A text file will be created in the 02-write-file folder.');
console.log(promptMessage);

rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
        farewellAndExit();
    } else {
        fileStream.write(input + '\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
    }
});

process.on('SIGINT', () => {
    farewellAndExit();
});

function farewellAndExit() {
    console.log('Goodbye! Thank you for using the program.');
    fileStream.end(); 
    rl.close();
    process.exit();
}