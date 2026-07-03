import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Oppretter en kobling til din lokale Ollama-server via OpenAI-standarden
const localOllama = createOpenAI({
  baseURL: 'http://127.0.0.1:11434/v1',
  apiKey: 'ollama', // Ollama krever ingen nøkkel, så vi kan skrive hva som helst
});

async function askDeepSeek() {
  console.log("Sender spørsmål til lokal DeepSeek (dette kan ta litt tid)...");
  
  const { text } = await generateText({
    model: localOllama('deepseek-r1:8b'), 
    prompt: 'Give me a 1-sentence tip on how to avoid bugs in JavaScript.',
  });

  console.log("\nDeepSeek sier:");
  console.log(text);
}

askDeepSeek();