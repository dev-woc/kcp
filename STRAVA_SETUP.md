# Strava Integration Setup Guide

This guide explains how to set up Strava OAuth integration for the Keep Pedaling Foundation application.

## Overview

The Strava integration allows users to:
- Connect their Strava accounts via OAuth
- Automatically sync cycling activities
- Track Wednesday community rides
- Display community ride statistics on the home page
- View personal ride metrics

## Prerequisites

1. A Strava account
2. Access to create a Strava API application

## Setup Steps

### 1. Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click "Create App" or "My API Application"
3. Fill in the application details:
   - **Application Name**: Keep Pedaling Foundation
   - **Category**: Health & Fitness
   - **Club**: (Optional) Link to your Strava club if you have one
   - **Website**: Your application URL (e.g., `https://yourdomain.com`)
   - **Authorization Callback Domain**: Your domain (e.g., `yourdomain.com`)
     - For development: `localhost`
     - For production: your actual domain

4. After creating the app, note down:
   - **Client ID**
   - **Client Secret**

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```bash
# Strava OAuth Configuration
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
STRAVA_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# Example:
# STRAVA_CLIENT_ID=12345
# STRAVA_CLIENT_SECRET=abc123def456
# STRAVA_WEBHOOK_VERIFY_TOKEN=STRAVA_VERIFY_KPF_2024
```

### 3. Set Up Webhook Subscription (Optional but Recommended)

Webhooks allow automatic syncing of new activities. To set this up:

1. Make sure your application is deployed and accessible via HTTPS
2. Use the Strava Webhook API to create a subscription:

```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F 'callback_url=https://yourdomain.com/api/strava/webhook' \
  -F 'verify_token=YOUR_VERIFY_TOKEN'
```

Replace:
- `YOUR_CLIENT_ID` with your Strava Client ID
- `YOUR_CLIENT_SECRET` with your Strava Client Secret
- `yourdomain.com` with your actual domain
- `YOUR_VERIFY_TOKEN` with the value from `STRAVA_WEBHOOK_VERIFY_TOKEN`

3. Verify the subscription was created:

```bash
curl -G https://www.strava.com/api/v3/push_subscriptions \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET
```

### 4. Testing the Integration

#### Local Development

For local testing:

1. Update your Strava app's Authorization Callback Domain to include `localhost`
2. The callback URL will be: `http://localhost:3000/api/strava/callback`
3. Users can connect via: `http://localhost:3000/dashboard`

#### Production

1. Update your Strava app's Authorization Callback Domain to your production domain
2. The callback URL will be: `https://yourdomain.com/api/strava/callback`
3. Set up webhook subscription using your production URL

## Features

### User Features

**Connect Strava Account**
- Users can connect their Strava account from the dashboard
- OAuth flow handles authentication securely
- Tokens are automatically refreshed when they expire

**Manual Sync**
- Users can manually sync their last 90 days of activities
- Only "Ride" type activities are imported

**Automatic Syncing**
- When webhooks are configured, new activities are automatically imported
- Activities are updated if modified on Strava
- Deleted activities are removed from the database

**Wednesday Ride Tracking**
- Activities completed on Wednesdays are automatically marked
- These are highlighted in statistics as community rides

### Admin/Metrics Features

**Global Statistics**
- Total miles ridden across all users
- Total elevation climbed
- Number of connected riders
- Wednesday community ride count

**Home Page Display**
- Statistics are displayed on the home page when users have connected Strava
- Orange-themed cards show ride metrics
- Only visible when at least one user has connected

## Database Schema

The integration adds the following to the User model:
- `stravaAthleteId`: Strava's unique athlete ID
- `stravaAccessToken`: Current OAuth access token
- `stravaRefreshToken`: Token for refreshing access
- `stravaTokenExpiry`: When the access token expires
- `stravaConnectedAt`: Timestamp of connection

And creates an Activity model to store:
- All ride data from Strava
- Whether it's a Wednesday ride
- Distance, elevation, speed metrics
- Activity type and timestamps

## API Endpoints

- `GET /api/strava/connect` - Initiate OAuth flow
- `GET /api/strava/callback` - OAuth callback handler
- `POST /api/strava/disconnect` - Disconnect Strava account
- `POST /api/strava/sync` - Manually sync activities
- `GET/POST /api/strava/webhook` - Webhook endpoint for automatic syncing
- `GET /api/metrics` - Get global metrics including ride statistics

## Troubleshooting

**Connection fails with "Invalid redirect URI"**
- Ensure your Authorization Callback Domain in Strava settings matches your domain
- For localhost, use just `localhost` (no protocol or port)

**Token expired errors**
- Tokens are automatically refreshed before API calls
- If issues persist, users can disconnect and reconnect

**Webhooks not working**
- Verify webhook subscription is active
- Check webhook URL is HTTPS (required by Strava)
- Verify `STRAVA_WEBHOOK_VERIFY_TOKEN` matches subscription

**Activities not syncing**
- Check user has granted `activity:read_all` scope
- Verify activities are of type "Ride"
- Try manual sync from dashboard

## Security Notes

- Never commit `.env` file with actual credentials
- Client secret should remain confidential
- Access tokens are encrypted at rest in the database
- Webhook verify token should be complex and unique

## Resources

- [Strava API Documentation](https://developers.strava.com/)
- [OAuth 2.0 Flow](https://developers.strava.com/docs/authentication/)
- [Webhook Events](https://developers.strava.com/docs/webhooks/)
