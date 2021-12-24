import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('start on port 3000.');
});

app.get('/test', (request, response) => {
  response.send(JSON.stringify({ message: 'hello expressjs!' }));
});
