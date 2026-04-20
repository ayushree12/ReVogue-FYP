const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const khaltiConfig = require('../config/khalti');

const withRetry = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (err) {
    if (retries >= khaltiConfig.MAX_RETRIES) {
      throw err;
    }
    return withRetry(fn, retries + 1);
  }
};

const postToKhalti = async (url, payload) => {
  try {
    return await withRetry(() =>
      axios.post(url, payload, {
        headers: {
          Authorization: `Key ${khaltiConfig.SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: khaltiConfig.TIMEOUT
      })
    );
  } catch (err) {
    console.error('Khalti API error', {
      url,
      payload,
      message: err?.message,
      response: err?.response?.data
    });
    throw err;
  }
};

exports.khaltiInitiate = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Amount (in paisa) is required for Khalti payment' });
  }
  if (!khaltiConfig.SECRET_KEY) {
    return res.status(400).json({ message: 'Khalti secret key is missing on the server' });
  }

  const payload = {
    amount,
    purchase_order_id: req.body.productId || `order-${Date.now()}`,
    purchase_order_name: req.body.productName || 'Revogue order',
    return_url: req.body.returnUrl || `${khaltiConfig.WEBSITE_URL}/checkout`,
    website_url: req.body.websiteUrl || khaltiConfig.WEBSITE_URL
  };

  const khaltiResponse = await postToKhalti(khaltiConfig.INITIATE_URL, payload);
  const { payment_url: paymentUrl, pidx, status } = khaltiResponse.data || {};
  if (!paymentUrl) {
    return res.status(502).json({ message: 'Khalti did not return a payment URL', response: khaltiResponse.data });
  }

  res.json({ paymentUrl, pidx, amount: payload.amount, status });
});

exports.khaltiVerify = asyncHandler(async (req, res) => {
  const { pidx } = req.body;
  if (!pidx) {
    return res.status(400).json({ message: 'Khalti pidx is required for verification' });
  }
  if (!khaltiConfig.SECRET_KEY) {
    return res.status(400).json({ message: 'Khalti secret key is missing on the server' });
  }

  const lookupResponse = await postToKhalti(khaltiConfig.LOOKUP_URL, { pidx });
  const lookupData = lookupResponse.data || {};
  const statusValue = typeof lookupData.status === 'string' ? lookupData.status.toLowerCase() : '';
  const success = statusValue === 'complete' || statusValue === 'completed';
  res.json({
    success,
    status: lookupData.status,
    data: lookupData
  });
});

exports.esewaInitiate = asyncHandler(async (req, res) => {
  const mockMode = !process.env.ESEWA_SERVICE_CODE;
  res.json({ provider: 'esewa', mockMode, amount: req.body.amount || 0 });
});

exports.esewaVerify = asyncHandler(async (req, res) => {
  const mockMode = !process.env.ESEWA_SERVICE_CODE;
  res.json({ verified: true, provider: 'esewa', mockMode });
});
