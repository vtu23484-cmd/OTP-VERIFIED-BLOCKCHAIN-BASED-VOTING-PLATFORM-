
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import OTP routes (correct way - no extra parameters)
const { router: otpRouter, verifiedVoters } = require('./routes/otpRoutes');

// Use OTP routes
app.use('/api', otpRouter);

// ========== YOUR EXISTING VOTING ROUTE ==========
// Modify this according to your existing vote function
app.post('/api/vote', async (req, res) => {
    const { sessionId, voterId, candidateId } = req.body;
    
    // Check if voter has verified OTP
    if (!sessionId || !verifiedVoters.has(sessionId)) {
        return res.status(401).json({ 
            error: 'You must verify your phone number before voting' 
        });
    }
    
    const verifiedSession = verifiedVoters.get(sessionId);
    
    // Check if verification is too old (10 minutes)
    if (Date.now() - verifiedSession.verifiedAt > 10 * 60 * 1000) {
        verifiedVoters.delete(sessionId);
        return res.status(401).json({ 
            error: 'Verification expired. Please verify again.' 
        });
    }
    
    // TODO: Add your blockchain vote casting logic here
    // Example: const result = await castVoteOnBlockchain(voterId, candidateId);
    
    // Clean up after successful vote
    verifiedVoters.delete(sessionId);
    
    res.json({ success: true, message: 'Vote recorded successfully on blockchain!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});



// Voter Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { fullName, aadharNumber, phoneNumber, constituency } = req.body;
    
    console.log('Registration request:', { fullName, aadharNumber, phoneNumber, constituency });
    
    if (!fullName || !aadharNumber || !phoneNumber || !constituency) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Here you would save to database
    // For now, just return success
    
    res.json({ 
        success: true, 
        message: `Voter ${fullName} registered successfully!`,
        voterId: aadharNumber
    });
});


// Registration endpoint
app.post('/api/register', (req, res) => {
    const { fullName, aadharNumber, phoneNumber, constituency } = req.body;
    
    console.log('Registration data:', { fullName, aadharNumber, phoneNumber, constituency });
    
    // Store in database or memory
    res.json({ 
        success: true, 
        message: `Voter ${fullName} registered successfully!`,
        voterId: aadharNumber
    });
});

// Vote storage
let voteCounts = {
    "Candidate A": 0,
    "Candidate B": 0,
    "Candidate C": 0
};

// Results endpoint
app.get('/api/results', (req, res) => {
    res.json(voteCounts);
});


// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
    console.log(`📱 OTP verification ready using Twilio`);
});


// REGISTRATION ENDPOINT - Add this entire block
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, aadharNumber, phoneNumber, constituency } = req.body;
        
        console.log('======== REGISTRATION REQUEST ========');
        console.log('Name:', fullName);
        console.log('Aadhar:', aadharNumber);
        console.log('Phone:', phoneNumber);
        console.log('Constituency:', constituency);
        console.log('=======================================');
        
        // Validate
        if (!fullName || !aadharNumber || !phoneNumber || !constituency) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        // TODO: Save to MySQL database here
        
        // Success response
        return res.json({ 
            success: true, 
            message: `Voter ${fullName} registered successfully!`,
            voterId: aadharNumber
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
