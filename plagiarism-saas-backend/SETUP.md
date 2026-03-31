# Backend Setup Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **Git**

## Step 1: Installation

1. Navigate to the backend directory:
   ```bash
   cd plagiarism-saas-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Step 2: Database Setup

### Option A: Local MongoDB
1. Install MongoDB Community Server on your machine
2. Start MongoDB service
3. The default connection string will work: `mongodb://localhost:27017/plagiarism-saas`

### Option B: MongoDB Atlas (Recommended for Production)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with password
4. Get your connection string
5. Whitelist your IP address (0.0.0.0/0 for development)

## Step 3: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   - **MONGO_URI**: Your MongoDB connection string
   - **JWT_SECRET**: Generate a secure random string (minimum 32 characters)
   - **PORT**: Server port (default: 5000)
   - **FRONTEND_URL**: Your frontend URL (default: http://localhost:5173)

## Step 4: API Keys Setup

### M-Pesa Daraja API (Sandbox)
1. Create an account at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create a new app
3. Get your Consumer Key and Consumer Secret
4. Update `.env` with:
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_PASSKEY` (provided in sandbox)
   - `MPESA_SHORTCODE` (174379 for sandbox)
   - `MPESA_CALLBACK_URL` (use ngrok for local testing)

### Plagiarism Detection APIs
1. **Copyscape**: Get API key from [Copyscape](https://www.copyscape.com/)
2. **Copyleaks**: Get API key from [Copyleaks](https://copyleaks.com/)
3. **GPTZero**: Get API key from [GPTZero](https://gptzero.me/)

*Note: The APIs include mock responses for development if you don't have API keys yet.*

## Step 5: Database Seeding

1. Seed the database with sample bundles:
   ```bash
   npm run seed
   ```

   This will create 6 default bundles (Starter to Enterprise).

## Step 6: Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 7: Test the API

1. Health check:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Test authentication:
   ```bash
   # Register
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. Get bundles:
   ```bash
   curl http://localhost:5000/api/bundles
   ```

## Step 8: Frontend Integration

Update your frontend's API configuration to point to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings
- Verify IP whitelist in Atlas

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory
- Check that variable names match exactly
- Restart the server after changing `.env`

### M-Pesa Callback Issues
- Use ngrok for local testing: `ngrok http 5000`
- Update callback URL in `.env` with ngrok URL
- Ensure ngrok is running when testing payments

## Development Tips

1. Use `nodemon` for automatic restarts during development
2. Check console logs for detailed error messages
3. Use Postman or similar tool for API testing
4. Mock API responses work without real API keys
5. File uploads are stored in `uploads/` directory

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Configure production M-Pesa API keys
4. Set up proper CORS origins
5. Use HTTPS for production
6. Set up proper logging and monitoring
7. Configure reverse proxy (nginx/Apache)

## Security Considerations

- Use strong JWT secrets
- Enable rate limiting
- Validate all inputs
- Use HTTPS in production
- Keep API keys secure
- Implement proper error logging
- Set up database backups
