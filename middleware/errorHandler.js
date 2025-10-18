const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'SyntaxError') {
    return res.status(400).json({ error: 'Bad JSON format' });
  }

  next(err);
};

module.exports = errorHandler;
