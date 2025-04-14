// Validate report data
const validateReportData = (data) => {
  const errors = [];

  // Check if URL is provided
  if (!data.url) {
    errors.push('URL is required');
  } else if (!isValidUrl(data.url)) {
    errors.push('Invalid URL format');
  }

  // Check if date is provided and valid
  if (!data.date) {
    errors.push('Date is required');
  } else if (isNaN(new Date(data.date).getTime())) {
    errors.push('Invalid date format');
  }

  // Return validation result
  return {
    valid: errors.length === 0,
    errors
  };
};

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// Format data for logging and webhook
const formatReportData = (data, source) => {
  const formattedData = {
    discord_id: data.discord_id || 'Not provided',
    url: data.url,
    date: data.date,
    notes: data.notes || 'No notes provided',
    source: source,
    reported_at: new Date().toISOString()
  };

  return formattedData;
};

module.exports = {
  validateReportData,
  formatReportData,
  isValidUrl
};