const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const projectAssetsPath = path.join(projectDist, 'assets');

async function createFolder(folderPath) {
    await fs.promises.mkdir(folderPath, { recursive: true });
}

async function readFile(filePath) {
    return await fs.promises.readFile(filePath, 'utf-8');
}

async function writeFile(filePath, content) {
    await fs.promises.writeFile(filePath, content);
}

async function copyFolder(src, dest) {
    await createFolder(dest);
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyFolder(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}

async function generateHtml() {
    let templateContent = await readFile(templatePath);

    const tags = templateContent.match(/{{\s*\w+\s*}}/g) || [];

    for (const tag of tags) {
        const componentName = tag.replace(/{{\s*|\s*}}/g, '');
        const componentPath = path.join(componentsPath, `${componentName}.html`);

        if (fs.existsSync(componentPath)) {
            const componentContent = await readFile(componentPath);
            templateContent = templateContent.replace(new RegExp(tag, 'g'), componentContent);
        } else {
            console.error(`Component not found: ${componentName}`);
        }
    }

    await writeFile(path.join(projectDist, 'index.html'), templateContent);
}

async function compileStyles() {
    const styleFiles = await fs.promises.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = styleFiles.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css'
    );

    let combinedStyles = '';

    for (const cssFile of cssFiles) {
        const filePath = path.join(stylesPath, cssFile.name);
        combinedStyles += await readFile(filePath) + '\n';
    }

    await writeFile(path.join(projectDist, 'style.css'), combinedStyles);
}

async function buildProject() {
    try {
        await createFolder(projectDist);
        await generateHtml();
        await compileStyles();
        await copyFolder(assetsPath, projectAssetsPath);

        console.log('Project built successfully!');
    } catch (err) {
        console.error('Error building project:', err);
    }
}

buildProject();
