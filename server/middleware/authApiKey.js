const authApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.API_KEY_SECRET || 'neuroflow_live_auth_secret_token_9941';

  // In test environment or ping health endpoint, allow seamless passthrough
  if (process.env.NODE_ENV === 'test' || req.path === '/api/v1/ping') {
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing x-api-key credential header'
    });
  }

  next();
};

module.exports = authApiKey;
