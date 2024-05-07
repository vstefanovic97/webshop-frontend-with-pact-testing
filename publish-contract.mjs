import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Pact Broker configuration
const BROKER_URL = "https://my-pact-broker.dev";
const USERNAME = "vukstefanovic97";
const PASSWORD = "test1234";
const PACT_DIRECTORY = "./pacts";
const CONSUMER_VERSION = "1.0.0";
const GIT_BRANCH = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// Helper function to read JSON files
async function readJsonFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Function to publish a single pact file
async function publishPact(filePath) {
  const pactData = await readJsonFile(filePath);
  const { name: consumerName } = pactData.consumer;
  const { name: providerName } = pactData.provider;
  const targetUrl = `${BROKER_URL}/pacts/provider/${providerName}/consumer/${consumerName}/version/${CONSUMER_VERSION}`;

  const response = await fetch(targetUrl, {
    method: 'PUT',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pactData)
  });

  if (!response.ok) {
    throw new Error(`Failed to publish pact: ${response.statusText}`);
  }

  console.log(`Published pact for ${consumerName} and ${providerName}`);
}

// Main function to publish all pacts
async function publishAllPacts() {
  const files = fs.readdirSync(PACT_DIRECTORY).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(PACT_DIRECTORY, file);
    try {
      await publishPact(filePath);
    } catch (error) {
      console.error(`Error publishing pact from file ${file}:`, error);
    }
  }

  console.log('All pacts have been published.');
}

// Run the publishing process
publishAllPacts().catch(console.error);
