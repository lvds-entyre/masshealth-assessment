// server.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Joi = require('joi'); // For input validation

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(bodyParser.json()); // Parse JSON bodies

// Define the path to the SQLite database file
const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || 'inquiries.db');

// Initialize SQLite3 Database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Create the inquiries table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testOrReal TEXT NOT NULL,
        residency TEXT NOT NULL,
        age TEXT NOT NULL,
        householdSize TEXT NOT NULL,
        householdIncome TEXT NOT NULL,
        assets TEXT NOT NULL,
        medicareEnrolled TEXT NOT NULL,
        disability TEXT NOT NULL,
        esrd TEXT NOT NULL,
        abiOrTbi TEXT NOT NULL,
        nursingFacility TEXT NOT NULL,
        nursingCareCriteria TEXT NOT NULL,
        intellectualDisability TEXT NOT NULL,
        communitySupportNeeded TEXT NOT NULL,
        transitioningFromInstitutionalCare TEXT NOT NULL,
        coordinatedCareNeeded TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error('Error creating inquiries table:', err.message);
        } else {
          console.log('Inquiries table is ready.');
        }
      }
    );
  }
});

// ========================
// API Endpoints
// ========================

/**
 * @route   POST /api/inquiries
 * @desc    Receive and store a new assessment inquiry
 * @access  Public
 */
app.post('/api/inquiries', (req, res) => {
  const data = req.body;

  // Define the validation schema using Joi
  const inquirySchema = Joi.object({
    testOrReal: Joi.string().valid('Test', 'Real').required(),
    residency: Joi.string().valid('Yes', 'No').required(),
    age: Joi.string()
      .valid('Under 18', '18-21', '21-64', '65 or older')
      .required(),
    householdSize: Joi.string()
      .pattern(/^\d+$/) // Ensure it's a number in string format
      .required(),
    householdIncome: Joi.string()
      .valid(
        'Less than $15,000',
        '$15,000 - $20,000',
        '$20,001 - $25,000',
        '$25,001 - $30,000',
        '$30,001 - $35,000',
        '$35,001 - $40,000',
        '$40,001 - $45,000',
        '$45,001 - $50,000',
        '$50,001 - $55,000',
        '$55,001 - $60,000',
        'Over $60,000'
      )
      .required(),
    assets: Joi.string()
      .valid('Less than $2,000', '$2,001 - $5,000', '$5,001 - $10,000', 'Over $10,000')
      .required(),
    medicareEnrolled: Joi.string().valid('Yes', 'No').required(),
    disability: Joi.string().valid('Yes', 'No').required(),
    esrd: Joi.string().valid('Yes', 'No').required(),
    abiOrTbi: Joi.string().valid('Yes', 'No').required(),
    nursingFacility: Joi.string().valid('Yes', 'No').required(),
    nursingCareCriteria: Joi.string().valid('Yes', 'No').required(),
    intellectualDisability: Joi.string().valid('Yes', 'No').required(),
    communitySupportNeeded: Joi.string().valid('Yes', 'No').required(),
    transitioningFromInstitutionalCare: Joi.string().valid('Yes', 'No').required(),
    coordinatedCareNeeded: Joi.string().valid('Yes', 'No').required(),
  });

  // Validate the incoming data against the schema
  const { error, value } = inquirySchema.validate(data);

  if (error) {
    // If validation fails, send a 400 Bad Request with the error message
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  // Destructure validated data
  const {
    testOrReal,
    residency,
    age,
    householdSize,
    householdIncome,
    assets,
    medicareEnrolled,
    disability,
    esrd,
    abiOrTbi,
    nursingFacility,
    nursingCareCriteria,
    intellectualDisability,
    communitySupportNeeded,
    transitioningFromInstitutionalCare,
    coordinatedCareNeeded,
  } = value;

  // Prepare the SQL INSERT statement with placeholders
  const query = `
    INSERT INTO inquiries (
      testOrReal,
      residency,
      age,
      householdSize,
      householdIncome,
      assets,
      medicareEnrolled,
      disability,
      esrd,
      abiOrTbi,
      nursingFacility,
      nursingCareCriteria,
      intellectualDisability,
      communitySupportNeeded,
      transitioningFromInstitutionalCare,
      coordinatedCareNeeded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Define the values in the order of the placeholders
  const params = [
    testOrReal,
    residency,
    age,
    householdSize,
    householdIncome,
    assets,
    medicareEnrolled,
    disability,
    esrd,
    abiOrTbi,
    nursingFacility,
    nursingCareCriteria,
    intellectualDisability,
    communitySupportNeeded,
    transitioningFromInstitutionalCare,
    coordinatedCareNeeded,
  ];

  // Execute the INSERT statement
  db.run(query, params, function (err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    // Respond with success and the ID of the inserted record
    res.status(201).json({ success: true, id: this.lastID });
  });
});

/**
 * @route   GET /api/inquiries
 * @desc    Retrieve all assessment inquiries
 * @access  Private (Adjust access control as needed)
 */
app.get('/api/inquiries', (req, res) => {
  // **Security Note:** Implement proper authentication and authorization here.
  // For example, check for an API key or JWT token before proceeding.

  // Example placeholder for access control (to be implemented)
  const isAuthorized = true; // Replace with real authorization logic

  if (!isAuthorized) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const query = `SELECT * FROM inquiries ORDER BY timestamp DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving data:', err.message);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    res.status(200).json({ success: true, inquiries: rows });
  });
});

// ========================
// Start the Server
// ========================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
