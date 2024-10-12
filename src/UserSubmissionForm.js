import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const UserSubmissionForm = () => {
  const [name, setName] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('socialMediaHandle', socialMediaHandle);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/submissions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Submission successful!');
      setName('');
      setSocialMediaHandle('');
      setImages([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Submission Form</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="socialMediaHandle">Social Media Handle:</label>
        <input
          type="text"
          id="socialMediaHandle"
          value={socialMediaHandle}
          onChange={(e) => setSocialMediaHandle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="images">Upload Images:</label>
        <input
          type="file"
          id="images"
          multiple
          onChange={(e) => setImages(e.target.files)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserSubmissionForm;