const express = require('express');
const app = express();
const db = require('./config/db');  // Import your MySQL database connection

// Middleware to parse JSON bodies
app.use(express.json());

// 1. Retrieve all patients
app.get('/patients', async (req, res) => {
  try {
    const query = 'SELECT id AS patient_id, first_name, last_name, date_of_birth FROM Patients';
    const [patients] = await db.promise().execute(query);
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patients', error });
  }
});

// 2. Retrieve all providers
app.get('/providers', async (req, res) => {
  try {
    const query = 'SELECT first_name, last_name, specialization AS provider_specialty FROM Doctors';
    const [providers] = await db.promise().execute(query);
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving providers', error });
  }
});

// 3. Filter patients by first name
app.get('/patients/search', async (req, res) => {
  const { first_name } = req.query;
  try {
    const query = 'SELECT id AS patient_id, first_name, last_name, date_of_birth FROM Patients WHERE first_name LIKE ?';
    const [patients] = await db.promise().execute(query, [`%${first_name}%`]);
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering patients', error });
  }
});

// 4. Retrieve providers by specialty
app.get('/providers/specialty', async (req, res) => {
  const { specialization } = req.query;
  try {
    const query = 'SELECT first_name, last_name, specialization AS provider_specialty FROM Doctors WHERE specialization LIKE ?';
    const [providers] = await db.promise().execute(query, [`%${specialization}%`]);
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering providers', error });
  }
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
