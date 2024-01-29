const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const OpenAI = require('openai');
const messages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: "", // Replask-f8h0M2IPSh4Q6DBKwpyzT3BlbkFJSoBJNjYHgJvMLSKFEsYJce with your OpenAI API key
});
//body: JSON.stringify({ action: 'send', input: recordedSpeech }),


async function main(input) {
  messages.push({ role: 'user', content: input });
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  });
  return chatCompletion.choices[0]?.message?.content;
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/api', async function(req, res, next) {
  if (req.body.action === 'send') {
    const mes = await main(req.body.input);
    messages.length = 0;
    res.json({ success: true, message: mes });
  } else {
    res.status(400).json({ success: false, message: 'Invalid action' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});