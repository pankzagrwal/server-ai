const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const serverless = require("serverless-http");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// Create a router to handle routes
const router = express.Router();

router.post("/test", (req, res) => {
  const { prompt } = req.body;
  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: true,
    })
    .then((response) => {
      res.send({ result: response?.data?.choices[0]?.text });
    })
    .catch(() => {
      res.send({
        result: "There was an error trying to connect to OpenAI ChatGPT-3",
      });
    });
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
