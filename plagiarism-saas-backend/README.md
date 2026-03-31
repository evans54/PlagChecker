# Plagiarism SaaS Backend

A comprehensive backend for a Student Plagiarism Detection SaaS application with M-Pesa payment integration, plagiarism checking APIs, and AI content detection.

## Features

- User authentication with JWT
- Bundle management system
- M-Pesa STK Push payment integration
- File upload and processing
- Plagiarism detection (Copyscape & Copyleaks APIs)
- AI content detection (GPTZero API)
- Report generation and management
- RESTful API with proper error handling

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- M-Pesa Daraja API
- Copyscape API
- Copyleaks API
- GPTZero API

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/plagiarism-saas
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   
   # M-Pesa Daraja API
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=174379
   MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa-callback
   
   # Plagiarism APIs
   COPYSCAPE_API_KEY=your_copyscape_api_key
   COPYLEAKS_API_KEY=your_copyleaks_api_key
   GPTZERO_API_KEY=your_gptzero_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Bundles
- `GET /api/bundles` - Get all available bundles
- `GET /api/bundles/slots` - Get user's current slots (protected)
- `POST /api/bundles/slots` - Add slots to user account (protected)
- `POST /api/bundles` - Create bundle (admin only)
- `PUT /api/bundles/:id` - Update bundle (admin only)
- `DELETE /api/bundles/:id` - Delete bundle (admin only)

### Upload
- `POST /api/upload` - Upload file (protected)
- `GET /api/upload/:uploadId` - Get upload status (protected)

### Reports
- `GET /api/reports` - Get all user reports (protected)
- `GET /api/reports/stats` - Get report statistics (protected)
- `GET /api/reports/recent` - Get recent reports (protected)
- `GET /api/reports/:id` - Get single report (protected)
- `GET /api/reports/:id/download` - Download report PDF (protected)
- `POST /api/reports/:id/regenerate` - Regenerate report (protected)
- `DELETE /api/reports/:id` - Delete report (protected)

### Payments
- `POST /api/payments/mpesa-stk` - Initiate M-Pesa STK Push (protected)
- `POST /api/payments/mpesa-callback` - M-Pesa callback (public)
- `GET /api/payments/mpesa-status/:checkoutRequestID` - Check payment status (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Models

### User
- name, email, password (hashed)
- slots (upload credits)
- role (user/admin)
- timestamps

### Bundle
- name, uploads, price
- description, popular flag
- timestamps

### Upload
- userId, fileName, originalName
- fileSize, fileType, filePath
- status, plagiarismScore, aiScore
- timestamps

### Report
- uploadId, userId, title
- plagiarismScore, aiScore
- sources array, summary
- pdfPath, status
- timestamps

## File Structure

```
src/
 ├─ controllers/
 │   ├─ authController.js
 │   ├─ bundleController.js
 │   ├─ uploadController.js
 │   ├─ reportController.js
 │   └─ paymentController.js
 ├─ models/
 │   ├─ User.js
 │   ├─ Bundle.js
 │   ├─ Upload.js
 │   └─ Report.js
 ├─ routes/
 │   ├─ authRoutes.js
 │   ├─ bundleRoutes.js
 │   ├─ uploadRoutes.js
 │   ├─ reportRoutes.js
 │   └─ paymentRoutes.js
 ├─ middleware/
 │   └─ authMiddleware.js
 ├─ utils/
 │   ├─ copyscapeAPI.js
 │   ├─ copyleaksAPI.js
 │   └─ gptZeroAPI.js
 ├─ app.js
 └─ server.js
```

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- Rate limiting (recommended for production)

## Development Notes

- The plagiarism APIs include mock responses for development
- File processing is handled asynchronously
- PDF reports are generated as text files (simplified implementation)
- M-Pesa integration uses sandbox environment by default

## Deployment

1. Set production environment variables
2. Update M-Pesa callback URL to production endpoint
3. Configure MongoDB connection string
4. Deploy to your preferred hosting platform (Railway, Heroku, AWS, etc.)

## License

ISC
