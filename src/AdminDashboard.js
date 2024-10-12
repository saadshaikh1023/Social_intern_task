import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from './AdminLogin';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSubmissions();
    }
  }, [isLoggedIn]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {submissions.map((submission) => (
        <div key={submission._id}>
          <h3>{submission.name}</h3>
          <p>Social Media Handle: {submission.socialMediaHandle}</p>
          <div>
            {submission.images.map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}${image}`}
                alt={`Uploaded by ${submission.name}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;  