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


module.exports={unknownEndpoint, errorHandler}