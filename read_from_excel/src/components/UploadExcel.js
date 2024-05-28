// src/components/UploadExcel.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadExcel = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('File uploaded successfully.');
    })
    .catch(error => {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      alert('Error uploading file.');
    });
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadExcel;
