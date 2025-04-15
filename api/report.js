require('dotenv').config();
const { authenticate, checkRateLimit } = require('./_lib/middleware');
const { validateReportData, formatReportData } = require('./_lib/utils');
const { sendToDiscordWebhook } = require('./_lib/webhook');

module.exports = async (req, res) => {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(authResult.status).json({ error: authResult.message });
  }

  // Apply rate limiting
  const rateLimitResult = checkRateLimit(req);
  if (!rateLimitResult.success) {
    return res.status(rateLimitResult.status).json({ error: rateLimitResult.message });
  }

  try {
    // Parse request body
    const reportData = req.body;

    // Validate report data
    const validation = validateReportData(reportData);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Format data with source from API key
    const formattedData = formatReportData(reportData, authResult.source);

    // Send to Discord webhook
    const webhookResult = await sendToDiscordWebhook(formattedData);

    if (!webhookResult.success) {
      return res.status(webhookResult.status || 500).json({
        error: 'Failed to send report to Discord',
        details: webhookResult.message
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Report received and forwarded to the DART Project',
      report_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Error processing report:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};