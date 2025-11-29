const rateLimit = require("express-rate-limit");
const { API_KEY } = require("./configuration");
const multer = require("multer");
const os = require("os");
const { AppError, ValidationError } = require("./app_error");

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
    return res.status(503).json({
      success: false,
      error: "Database service unavailable",
    });
  }

  if ((error.code && error.code.startsWith("22")) || error.code === "23505") {
    return res.status(400).json({
      success: false,
      error: "Invalid request data",
    });
  }

  if (error.code && error.code.startsWith("23")) {
    return res.status(400).json({
      success: false,
      error: "Data constraint violation",
    });
  }
  next(error)
};

const keyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || API_KEY !== apiKey) {
    return res.status(401).json({
      success: false,
      error: "Unauthorised: invalid authentication credentials",
    });
  }
  next();
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new ValidationError("Invalid file format, only CSV allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = { upload, unknownEndpoint, errorHandler, keyAuth, limiter };
