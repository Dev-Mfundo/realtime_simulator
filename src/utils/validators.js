const { ValidationError } = require("./app_error");

const validateSymbol = (symbol) => {
  if (!symbol || symbol.length === 0) {
    throw new ValidationError("Symbol input missing!");
  }
  if (typeof symbol !== "string") {
    throw new ValidationError("Symbol input should be a string");
  }
  symbol = symbol.toLowerCase();
  if (!/^[a-z0-9]+$/.test(symbol)) {
    throw new ValidationError(
      "Symbol can only consist of alphanumeric characters and with no spaces",
    );
  }
  return symbol;
};

const validateNumericField = (value, fieldName, lineNumber) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new ValidationError(
      `Invalid ${fieldName} value at line ${lineNumber}: "${value}"`,
    );
  }
  return num;
};

const validateTimestamp = (timestamp, lineNumber) => {
  if (!timestamp || timestamp.trim() === "") {
    throw new ValidationError(`Empty timestamp at line ${lineNumber}`);
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new ValidationError(
      `Invalid timestamp format at line ${lineNumber}: "${timestamp}"`,
    );
  }

  return timestamp;
};

const validateMultipleSymbols = (symbols) => {
  if (!Array.isArray(symbols)) {
    throw new ValidationError("Symbols must be an array");
  }
  if (symbols.length === 0) {
    throw new ValidationError("Symbols array cannot be empty");
  }
  if (symbols.length > 50) {
    throw new ValidationError("Cannot query more than 50 symbols at once");
  }
  return symbols.map(validateSymbol);
};

const validateTimeframe = (timeframe) => {
  const allowedTimeframe = [1, 5, 15, 30, 60, 120, 240, 1440];

  if (timeframe === undefined || timeframe === null) {
    throw new ValidationError("Timeframe input missing");
  }

  const parsed =
    typeof timeframe === "string" ? parseInt(timeframe, 10) : timeframe;

  if (isNaN(parsed)) {
    throw new ValidationError("Timeframe must be a number or numeric string");
  }

  if (!allowedTimeframe.includes(parsed)) {
    throw new ValidationError(
      `Invalid timeframe: allowed timeframe inputs ${allowedTimeframe.join(", ")}`,
    );
  }

  return parsed;
};

const validateDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ValidationError("Invalid date format. Use YYYY-MM-DD");
  }

  if (start > end) {
    throw new ValidationError(
      "Start date must be before or equal to end date.",
    );
  }

  const now = new Date();
  if (start > now || end > now) {
    throw new ValidationError("Dates cannot be in the future.");
  }

  return { start, end };
};

const validateLimit = (limit) => {
  const parsed = parseInt(limit, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new ValidationError("Limit must be a positive integer");
  }
  if (parsed > 5000) {
    throw new ValidationError("Limit cannot exceed 5000");
  }
  return parsed;
};

module.exports = {
  validateSymbol,
  validateTimeframe,
  validateTimestamp,
  validateNumericField,
  validateLimit,
  validateDate,
  validateMultipleSymbols,
};
