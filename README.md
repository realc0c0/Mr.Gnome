# Mr.Gnome Tap-to-Earn Telegram Mini App

A Telegram Mini App that allows users to earn tokens through tapping, completing tasks, and engaging with the platform.

## Environment Setup

Before running the app, you need to set up the following environment variables:

### 1. Supabase Configuration
Sign up at [Supabase](https://supabase.com) and create a new project:
- `REACT_APP_SUPABASE_URL`: Found in Project Settings -> API -> Project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Found in Project Settings -> API -> anon/public key

### 2. Telegram Bot Setup
Create a bot using [@BotFather](https://t.me/BotFather):
1. Start a chat with BotFather
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Set `REACT_APP_BOT_USERNAME` to your bot's username (without @)

### 3. TON Network Configuration
Set `REACT_APP_TON_NETWORK` to either:
- `mainnet` for production
- `testnet` for development/testing

### 4. API Configuration
Set `REACT_APP_API_BASE_URL` to your backend API URL:
- If using custom backend: Your deployed API URL
- If using Supabase Edge Functions: Your Supabase function URL

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your environment variables in `.env`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start development server:
   ```bash
   npm start
   ```

## Deployment

1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service
3. Configure your Telegram bot's webapp URL in BotFather

## Security Notes

- Never commit `.env` file
- Keep your bot token secret
- Use environment variables for sensitive data
- Always use HTTPS in production
- Implement rate limiting for API endpoints

## Support

For support, please join our [Telegram Group](your_support_group_link) or create an issue in this repository.
