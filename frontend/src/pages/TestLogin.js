import React, { useEffect } from 'react';
import axios from 'axios';

const TestCors = () => {
  useEffect(() => {
    axios.post('http://localhost:5000/api/login', {
      email: 'test@example.com',
      password: '123'
    }, {
      withCredentials: true
    })
    .then(res => {
      console.log('✅ Login test success:', res.data);
    })
    .catch(err => {
      console.error('❌ Login test error:', err.message);
    });
  }, []);

  return <div>Testing CORS...</div>;
};

export default TestCors;
