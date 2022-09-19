import { app } from "../../app";

export const getTest = () => {
  app.get('/test', (_, response) => {
    response.send(JSON.stringify({ message: 'hello expressjs!' }));
  });
};
