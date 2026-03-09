const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // This is not a standard method in the SDK but we can try to find how to list models
    // or just try a few and see.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-ultra"];
    
    for (const modelName of models) {
      try {
        console.log(`Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`✅ SUCCESS with ${modelName}:`, response.text().substring(0, 20));
        return;
      } catch (e) {
        console.log(`❌ FAILED with ${modelName}:`, e.message);
      }
    }
  } catch (err) {
    console.error('GLOBAL FAILED:', err.message);
  }
}

run();
