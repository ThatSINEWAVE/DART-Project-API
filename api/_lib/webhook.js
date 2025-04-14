const axios = require('axios');

// Send data to Discord webhook
const sendToDiscordWebhook = async (data) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('Discord webhook URL is not configured');
  }

  // Create Discord embed
  const embed = {
    title: '🚨 Malicious URL Report',
    color: 0xFF0000, // Red color
    fields: [
      {
        name: 'Suspicious URL',
        value: data.url,
        inline: false
      },
      {
        name: 'Discord User ID',
        value: data.discord_id,
        inline: true
      },
      {
        name: 'Date Sent',
        value: data.date,
        inline: true
      },
      {
        name: 'Reported By',
        value: data.source,
        inline: true
      },
      {
        name: 'Notes',
        value: data.notes,
        inline: false
      }
    ],
    footer: {
      text: `Reported at ${data.reported_at}`
    }
  };

  const payload = {
    embeds: [embed]
  };

  try {
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status
    };
  } catch (error) {
    console.error('Error sending to Discord webhook:', error.message);
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.message
    };
  }
};

module.exports = {
  sendToDiscordWebhook
};