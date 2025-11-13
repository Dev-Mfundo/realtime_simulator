const rateLimit = require('express-rate-limit')
const {API_KEY} = require('./configuration')
const multer = require('multer');
const os = require('os');

const unknownEndpoint=(req, res)=>{
	res.status(404).json({
		success: false,
		error: "Unknown endpoint"
	})
}

const errorHandler = (error, req, res, next) => {
  if (
    error.name === 'ValidationError' ||
    error.name === 'CastError' ||
    error instanceof Error
  ) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
  next(error);
};


const keyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey || API_KEY !== apiKey) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid authentication credentials'
        });
    }
    next();
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    error: 'Too many requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, 
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Save to temp directory
  }
  // No filename function — multer will auto-generate a safe name
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Invalid file format, only CSV allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});


module.exports={upload,unknownEndpoint, errorHandler, keyAuth, limiter}