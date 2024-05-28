// server/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'student',
  database: 'IOCProject'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = XLSX.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const insertPromises = xlData.map((row) => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO your_table SET ?';
        db.query(query, row, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    Promise.all(insertPromises)
      .then(results => {
        fs.unlinkSync(file.path); // Clean up the uploaded file
        res.send('Data uploaded successfully.');
      })
      .catch(err => {
        console.error('Error uploading data:', err);
        res.status(500).send('Error uploading data.');
      });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file.');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
