require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./route/route');

const app = express();
const port = process.env.PORT || 3000;
const DBURL=process.env.DBURL;
const connectDB=require('./config/db')
// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter globally
app.use(apiLimiter);

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
connectDB(DBURL)
// Health Check
app.get('/health', (req, res) => {
    res.status(200).send({ health: "healthy" });
});

// Routes
app.use('/myfinance', router);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



