const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path')
const mongoose = require('mongoose')
const File = require('./Models/Files')

PORT = 3000;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect('mongodb://127.0.0.1/file', options)
const connection = mongoose.connection;
connection.on('error', console.log)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const id = uuid();
    const filePath = `files/${id}${ext}`;
    File.create({ filePath })
      .then(() => {
        cb(null, filePath)
      })
  }
})
const upload = multer({ storage })
const app = express();
app.use(express.static('public'));
app.use(express.static('uploads'));


app.post('/upload', upload.array('file-name'), (req, res) => {
  return res.redirect('/')
})

app.get('/files', (req, res) => {
  File.find()
    .then((files) => {
      return res.json({ status: 'OK', files })
    })
})

app.listen(PORT, () => console.log('App listening on port', PORT))