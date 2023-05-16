// Librerías
const fs = require('fs');
const path = require('path')
const express = require('express');
const engine = require('ejs-mate');

// Instancia de app
const app = express();
app.set('views', path.join(__dirname, '/public'))
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

const search = (words) => {
  const filesPath = path.join(__dirname, 'public', 'Files');
  const files = fs.readdirSync(filesPath);
  const result = [];

  files.forEach((file) => {
    const startTime = new Date().getTime();
    const filePath = path.join(filesPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const endTime = new Date().getTime();
    const timeTaken = endTime - startTime;

    words.forEach((w) => {
      if (fileContent.includes(w)) {
        result.push({ file, time: timeTaken });
        return;
      }
    })
    
  });

  return result;
};

// Routers
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/results', (req, res) => {
  const words = req.query.search_query.split(" ")
  const results = search(words);

  res.render('results', {
    word: req.query.search_query,
    results: results.slice(0, 10)
  });
});

// Ejecutar servidor
app.listen(3000, '0.0.0.0', () => {
  console.log('Server started on port 3000');
});