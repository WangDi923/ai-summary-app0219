const OpenAI = require("openai");

const DEEPSEEK_API_KEY = "sk-75a3dda97c1f4f0d9b87a4eeac5143aa";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: DEEPSEEK_API_KEY,
});

async function main() {
  console.log("Connecting...");
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "deepseek-chat",
    });
    console.log("Success! AI says:", completion.choices[0].message.content);
  } catch (error) {
    console.error("Failed!");
    console.error(error.message);
  }
}

main();