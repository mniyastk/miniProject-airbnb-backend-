module.exports = function (err, req, res, next) {
    // Check if headers have already been sent
    if (res.headersSent) {
      return next(err); // Pass the error to the next error handler
    }
  
    // Set the response status to 500 and send an error message
    res.status(500).send("Internal server error");
  };
  