require("dotenv").config();

const http = require("http");
const url = require("url");
const fs = require("fs");
const pathModule = require("path");
const nodemailer = require("nodemailer");

// ----------------------------
// Helpers
// ----------------------------
function serveFile(res, filePath, contentType, statusCode = 200) {
  res.writeHead(statusCode, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
}

function sendHtml(res, html, statusCode = 200) {
  res.writeHead(statusCode, { "Content-Type": "text/html" });
  res.end(html);
}

// ----------------------------
// Email sender (NEW)
// ----------------------------
async function sendEmail(name, email, message) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${name}`,
    text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });
}

// ----------------------------
// Route Handlers map
// ----------------------------
const routeHandlers = {
  "/": homeHandler,
  "/index.html": homeHandler,
  "/aboutMe": aboutHandler,
  "/ai": aiHandler,
  "/design": designHandler,
  "/technology": techHandler,
  "/events": eventsHandler,
  "/contact": contactHandler,

  "/style.css": cssHandler,
  "/animations.js": jsHandler,

  // images
  "/image/me.jpeg": imageHandler,
  "/image/whatsapp-profile.jpeg": aboutMeimageHandler,
  "/image/bugtracker.png": bugTrackerHandler,
  "/image/1.png": image1Handler,
  "/image/2.png": image2Handler,
  "/image/3.png": image3Handler,
  "/image/4.png": image4Handler,
  "/image/5.png": image5Handler,
  "/image/6.png": image6Handler,
  "/image/Everbloom.png": imageEverbloomHandler,
  "/image/Everbloom2.png": imageEverbloom2Handler,
  "/image/MIREU.png": imageMIREUHandler,
  "/image/MIREU2.png": imageMIREU2Handler,
  "/image/ocbc.png": imageocbcHandler,
  "/image/CA2 Digital Poster.png": imageCA2PosterHandler,

  // videos
  "/image/CA1AR.mp4": videoHandler,
  "/image/c346CA2.mp4": videoC346Handler,
};

// ----------------------------
// Create Server
// ----------------------------
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  const handler = routeHandlers[pathname] || notFoundHandler;
  handler(req, res);
});

// ----------------------------
// Page Handlers
// ----------------------------
function homeHandler(req, res) {
  serveFile(res, "index.html", "text/html");
}

function aboutHandler(req, res) {
  serveFile(res, "aboutMe.html", "text/html");
}

function designHandler(req, res) {
  serveFile(res, "design.html", "text/html");
}

function aiHandler(req, res) {
  serveFile(res, "ai.html", "text/html");
}

function techHandler(req, res) {
  serveFile(res, "technology.html", "text/html");
}

function eventsHandler(req, res) {
  serveFile(res, "events.html", "text/html");
}

// ✅ CONTACT HANDLER (GET + POST) - keep ONLY this one
function contactHandler(req, res) {
  if (req.method === "GET") {
    return serveFile(res, "contact.html", "text/html");
  }

  if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
      // simple protection against huge spam payloads
      if (body.length > 1e6) req.destroy();
    });

    req.on("end", async () => {
      const data = new URLSearchParams(body);

      const name = (data.get("name") || "").trim();
      const email = (data.get("email") || "").trim();
      const message = (data.get("message") || "").trim();

      // basic validation
      if (!name || !email || !message) {
        return sendHtml(
          res,
          "<h1>❌ Please fill in all fields.</h1><a href='/contact'>Back</a>",
          400
        );
      }

      try {
        await sendEmail(name, email, message);
        return sendHtml(
          res,
          "<h1>✅ Message sent successfully!</h1><a href='/contact'>Back</a>"
        );
      } catch (err) {
        console.error(err);
        return sendHtml(
          res,
          "<h1>❌ Failed to send message</h1><p>Check your EMAIL_USER / EMAIL_PASS in .env</p><a href='/contact'>Back</a>",
          500
        );
      }
    });

    return;
  }

  // method not allowed
  res.writeHead(405, { "Content-Type": "text/plain" });
  res.end("Method Not Allowed");
}

function cssHandler(req, res) {
  serveFile(res, "style.css", "text/css");
}

function jsHandler(req, res) {
  serveFile(res, "animations.js", "text/javascript");
}

// ----------------------------
// Media Handlers
// ----------------------------
function imageHandler(req, res) {
  serveFile(res, "image/me.jpeg", "image/jpeg");
}

function aboutMeimageHandler(req, res) {
  serveFile(res, "image/whatsapp-profile.jpeg", "image/jpeg");
}

function bugTrackerHandler(req, res) {
  serveFile(res, "image/bugtracker.png", "image/png");
}

function image1Handler(req, res) {
  serveFile(res, "image/1.png", "image/png");
}

function image2Handler(req, res) {
  serveFile(res, "image/2.png", "image/png");
}

function image3Handler(req, res) {
  serveFile(res, "image/3.png", "image/png");
}

function image4Handler(req, res) {
  serveFile(res, "image/4.png", "image/png");
}

function image5Handler(req, res) {
  serveFile(res, "image/5.png", "image/png");
}

function image6Handler(req, res) {
  serveFile(res, "image/6.png", "image/png");
}

function imageCA2PosterHandler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/CA2 Digital Poster.png", "image/png");
}

function imageEverbloomHandler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/Everbloom.png", "image/png");
}

function imageEverbloom2Handler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/Everbloom2.png", "image/png");
}

function imageMIREUHandler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/MIREU.png", "image/png");
}

function imageMIREU2Handler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/MIREU2.png", "image/png");
}

function imageMIREUHandler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/MIREU.png", "image/png");
}

function imageMIREU2Handler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/MIREU2.png", "image/png");
}

function imageocbcHandler(req, res) {
  // if your poster is actually a PNG, keep image/png; if it's JPEG, change it
  serveFile(res, "image/ocbc.png", "image/png");
}

// video streaming (your original logic style)
function videoHandler(req, res) {
  const videoPath = "image/CA1AR.mp4";

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      return res.end("Video not found");
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      return fs.createReadStream(videoPath).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
      return res.end();
    }

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  });
}

function videoC346Handler(req, res) {
  // your original had "image/image/..." - fixed to just image/...
  const videoPath = pathModule.join(__dirname, "image", "c346CA2.mp4");

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      return res.end("Video not found");
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      return fs.createReadStream(videoPath).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
      return res.end();
    }

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  });
}

// ----------------------------
// 404
// ----------------------------
function notFoundHandler(req, res) {
  sendHtml(res, "<h1>404 Not Found</h1>", 404);
}

// ----------------------------
// Start server
// ----------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
