const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { getStandardHeader } = require('../shared/common-function');

const proxyApi = async (req, res) => {
  try {
    const sessionToken = req.headers['session-token'];
    const sessionTokenBkd = req.headers['session-token-bkd'];

    if (!sessionToken || !sessionTokenBkd) {
      return res.status(401).json({error: 'Missing authentication tokens'});
    }

    // Use getStandardHeader to construct headers
    const headers = getStandardHeader(req, sessionToken, sessionToken, sessionTokenBkd, 'application/json');
    headers['Content-Type'] = 'application/json';
    headers['session-token'] = sessionToken;
    headers['session-token-bkd'] = sessionTokenBkd;

    const response = await axios({
      method: req.method,
      url: process.env.DIRECTORY_BACKEND_URL + req.path,
      data: req.body,
      headers: headers
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('ProxyApi Error:', error);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal Server Error'
    });
  }
};

module.exports = {
  proxyApi
};

