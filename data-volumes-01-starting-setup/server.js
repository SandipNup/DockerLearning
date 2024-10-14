const fs = require('fs').promises;
const exists = require('fs').exists;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  console.log("test heelo");
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();
  const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
  const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

  // Ensure the temp directory exists
  const tempDir = path.join(__dirname, 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  // Ensure the feedback directory exists
  const feedbackDir = path.join(__dirname, 'feedback');
  await fs.mkdir(feedbackDir, { recursive: true });

  try {
    // Write the file
    await fs.writeFile(tempFilePath, content);
    console.log(`Temporary file created: ${tempFilePath}`);
    
    // Check if the final file exists
    await fs.access(finalFilePath);
    res.redirect('/exists');
  } catch (err) {
    // If the file doesn't exist, it will throw an error here
    if (err.code === 'ENOENT') {
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      console.log(`Renamed ${tempFilePath} to ${finalFilePath}`);
      res.redirect('/');
    } else {
      console.error('Error accessing final file:', err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(process.env.PORT);
