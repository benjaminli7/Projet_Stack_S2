import axios from 'axios';

// Make a request to the backend to get the Google authentication URL
axios.get('http://localhost:3000/auth/google/url')
  .then(response => {
    const authUrl = response.data.authUrl;
    // Redirect the user to the Google authentication URL
    window.location.href = authUrl;
  })
  .catch(error => {
    // Handle the error
  });
