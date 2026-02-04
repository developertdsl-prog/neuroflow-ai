const tokenTracker = (req, res, next) => {
  req.tokenMetrics = {
    promptTokens: 0,
    completionTokens: 0,
    recordUsage: function(prompt = 0, completion = 0) {
      this.promptTokens += prompt;
      this.completionTokens += completion;
    }
  };
  next();
};

module.exports = tokenTracker;
