import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/scanId.css';

const ScanId = () => {
  const [scanResult, setScanResult] = useState('');
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result
          .replace('data:', '')
          .replace(/^.+,/, '');
        try {
          await axios.post('http://localhost:5000/api/auth/scanid', {
            idData: base64String,
          });
          navigate('/main-screen-off');
        } catch (error) {
          console.error('Error processing image:', error);
          setScanResult('Error processing image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='container'>
      <h1>Scan your College ID</h1>
      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
      />
      {scanResult && <p>Scanned Data: {scanResult}</p>}
    </div>
  );
};

export default ScanId;
