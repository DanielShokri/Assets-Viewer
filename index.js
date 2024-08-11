const fs = require('fs');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const { exec } = require('child_process');
const net = require('net');

const app = express();
const basePort = 3111;

// Set the correct path for the templates folder
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function scanDirectory(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(scanDirectory(filePath));
    } else if (allowedExtensions.includes(path.extname(filePath).toLowerCase())) {
      results.push(filePath);
    }
  });

  return results;
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port, '0.0.0.0');
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (await isPortInUse(port)) {
    port++;
  }
  return port;
}

async function generateAssetViewer(assetDir) {
  const assets = scanDirectory(assetDir).map((asset) => ({
    name: path.basename(asset),
    path: encodeURIComponent(path.relative(assetDir, asset)),
    type: path.extname(asset).slice(1).toLowerCase(),
  }));

  app.get('/', (req, res) => {
    res.render('template', { assets });
  });

  app.use('/assets', express.static(assetDir));

  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  const port = await findAvailablePort(basePort);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Asset viewer is running at http://localhost:${port}`);
    const openCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${openCommand} http://localhost:${port}`);
  });

  process.on('SIGINT', () => {
    console.log('Asset viewer server stopped.');
    process.exit(0);
  });
}

function main() {
  const args = process.argv.slice(2);
  const directoryFlag = args.indexOf('-d');
  let assetDir;

  if (directoryFlag !== -1 && args[directoryFlag + 1]) {
    assetDir = args[directoryFlag + 1];
  } else {
    assetDir = process.cwd();
  }

  generateAssetViewer(assetDir);
}

main();

module.exports = { generateAssetViewer };