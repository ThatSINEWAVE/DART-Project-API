# The DART Project API Documentation

## Overview

The DART Project API is designed to help Discord communities and anti-phishing initiatives report and track malicious URLs shared on Discord. This documentation provides everything you need to integrate with our API and contribute to making Discord a safer place.

## Getting Started

### Base URL
```
https://dart-project-api.vercel.app/api
```

### Authentication
All requests require an API key provided by The DART Project team. Include your API key in each request using the `X-API-Key` header.

```
X-API-Key: your_api_key_here
```

To request an API key, please contact the `sinewave_` on Discord.

## Endpoints

### Report Malicious URL

```
POST /report
```

Submit a report of a malicious URL encountered on Discord.

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | Must be set to `application/json` |
| X-API-Key | Yes | Your DART Project API key |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | String | Yes | The suspicious URL that was shared |
| date | String | Yes | ISO 8601 formatted date when the URL was shared (e.g., `2025-04-14T12:00:00Z`) |
| discord_id | String | No | Discord user ID of the account that shared the URL |
| notes | String | No | Additional information about the URL or context |

#### Example Request

```json
{
  "discord_id": "123456789012345678",
  "url": "https://malicious-site.example.com/discord-nitro",
  "date": "2025-04-14T15:30:00Z",
  "notes": "User was sharing this as a free Discord Nitro offer"
}
```

#### Response

A successful response will return a 200 status code and a JSON object:

```json
{
  "success": true,
  "message": "Report received and forwarded to Discord",
  "report_id": "1713203716543-x7f2g9p3q"
}
```

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Report has been processed |
| 400 | Bad Request - Missing required fields or invalid data |
| 401 | Unauthorized - Invalid or missing API key |
| 429 | Too Many Requests - Rate limit exceeded (120 requests per minute) |
| 500 | Internal Server Error - Something went wrong on our end |

### Error Response Examples

Invalid URL format:
```json
{
  "errors": ["Invalid URL format"]
}
```

Missing required field:
```json
{
  "errors": ["URL is required"]
}
```

Rate limit exceeded:
```json
{
  "error": "Rate limit exceeded. Try again in 1 minute."
}
```

## Best Practices

1. **Validate URLs** before submitting them to avoid unnecessary reports
2. **Include Discord IDs** when available to help track patterns of malicious activity
3. **Add detailed notes** to provide context about the report
4. **Implement retry logic** with exponential backoff if you encounter rate limiting
5. **Store your API key securely** and never expose it in client-side code

## Code Examples

### Python

```python
import requests
import datetime

api_key = "your_api_key_here"
api_url = "https://dart-project-api.vercel.app/api/report"

headers = {
    "Content-Type": "application/json",
    "X-API-Key": api_key
}

payload = {
    "discord_id": "123456789012345678",
    "url": "https://suspicious-url.example.com",
    "date": datetime.datetime.now().isoformat(),
    "notes": "This URL was sent in multiple servers within minutes"
}

response = requests.post(api_url, headers=headers, json=payload)
print(response.json())
```

### JavaScript

```javascript
const reportMaliciousUrl = async () => {
  const apiKey = "your_api_key_here";
  const apiUrl = "https://dart-project-api.vercel.app/api/report";
  
  const payload = {
    discord_id: "123456789012345678",
    url: "https://suspicious-url.example.com",
    date: new Date().toISOString(),
    notes: "User was spamming this link in multiple channels"
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error reporting malicious URL:", error);
  }
};
```

## Rate Limiting

The API is limited to 120 requests per minute per API key. If you exceed this limit, you'll receive a 429 response code. Please implement appropriate rate limiting in your client applications.

## Support

If you encounter any issues or have questions about the API, please contact the `sinewave_` on Discord.
