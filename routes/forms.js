const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (HTML forms)
app.use(express.urlencoded({
  extended: true,  // Use qs library for nested objects
  limit: '10mb',
  parameterLimit: 1000, // Max number of parameters
}));

app.post('/submit-form', (req, res) => {
  const { username, password } = req.body;
  
  // Validate and process...
  res.redirect('/dashboard');
});

app.listen(3000);