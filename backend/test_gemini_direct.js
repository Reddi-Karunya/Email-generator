const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function run() {
  try {
    console.log('Testing with direct fetch (v1beta)...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!res.ok) {
        console.error('LIST FAILED:', res.status, JSON.stringify(data, null, 2));
        return;
    }
    
    console.log('SUCCESS: Models listed.');
    console.log('First 3 models:', data.models.slice(0, 3).map(m => m.name));
    
    // Test generation for the first one that supports it
    const model = data.models.find(m => m.name.includes('gemini-1.5-flash')) || data.models[0];
    console.log('Testing generation with:', model.name);
    
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${apiKey}`;
    const genRes = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hi" }] }]
      })
    });
    const genData = await genRes.json();
    
    if (!genRes.ok) {
        console.error('GENERATION FAILED:', genRes.status, JSON.stringify(genData, null, 2));
    } else {
        console.log('GENERATION SUCCESS:', genData.candidates[0].content.parts[0].text);
    }
    
  } catch (err) {
    console.error('GLOBAL FAILED:', err.message);
  }
}

run();
