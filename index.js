const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");
const ejs = require("ejs");

let server; // Declare server outside to keep track of it

function scanDirectory(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']; // Add allowed extensions

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(scanDirectory(filePath));
    } else if (allowedExtensions.includes(path.extname(filePath).toLowerCase())) { // Check extension
      results.push(filePath);
    }
  });

  return results;
}

function generateAssetViewer(assetDir) {
  const assets = scanDirectory(assetDir).map((asset) => ({
    name: path.basename(asset),
    path: encodeURIComponent(path.relative(assetDir, asset)),
    type: path.extname(asset).slice(1).toLowerCase(),
  }));

  const templatePath = path.join(__dirname, "templates", "template.ejs");
  const template = fs.readFileSync(templatePath, "utf-8");

  const html = ejs.render(template, { assets });

  function startServer(port = 3111) {
    if (server) {
      console.log('Server is already running.');
      return;
    }

    server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);

      if (parsedUrl.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else if (parsedUrl.pathname.startsWith("/assets/")) {
        const decodedPath = decodeURIComponent(parsedUrl.pathname.substr(8));
        const filePath = path.join(assetDir, decodedPath);

        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end("File not found");
          } else {
            const ext = path.extname(filePath).toLowerCase();
            const contentType =
              {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".gif": "image/gif",
                ".webp": "image/webp",
                ".svg": "image/svg+xml",
              }[ext] || "application/octet-stream";

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
          }
        });
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use.`);
        process.exit(1); 
      } else {
        console.error('Error starting server:', err);
        process.exit(1); 
      }
    });

    server.listen(port, '0.0.0.0', () => {
      console.log(`Asset viewer is running at http://localhost:${port}`);
      const open =
        process.platform == "darwin"
          ? "open"
          : process.platform == "win32"
          ? "start"
          : "xdg-open";
      require("child_process").exec(open + " http://localhost:" + port);
    });
  }

  // Graceful server shutdown
  process.on('SIGINT', () => {
    if (server) {
      server.close(() => {
        console.log('Asset viewer server stopped.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  startServer(); 
}

module.exports = { generateAssetViewer };
