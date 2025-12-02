// server/mockDataServer.js
const { WebSocketServer } = require('ws');
const esgDataManager = require('../src/utils/esgDataManager.cjs');

const wss = new WebSocketServer({ port: 8080 });

console.log('Mock data server started on ws://localhost:8080');

// Function to generate slightly randomized data based on the initial data
function getUpdatedData() {
  const initialScores = esgDataManager.getScores();
  
  // Helper to add a random +/- 5% fluctuation
  const fluctuate = (value) => value * (1 + (Math.random() - 0.5) * 0.1);

  initialScores.environmental = Math.min(100, Math.max(0, fluctuate(initialScores.environmental)));
  initialScores.social = Math.min(100, Math.max(0, fluctuate(initialScores.social)));
  initialScores.governance = Math.min(100, Math.max(0, fluctuate(initialScores.governance)));

  for (const framework in initialScores.frameworks) {
    initialScores.frameworks[framework].progress = Math.min(100, Math.max(0, fluctuate(initialScores.frameworks[framework].progress)));
  }

  return initialScores;
}

wss.on('connection', ws => {
  console.log('Client connected');

  // Send initial data
  ws.send(JSON.stringify({ type: 'esg-scores', payload: esgDataManager.getScores() }));

  // Send updated data every 5 seconds
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'esg-scores', payload: getUpdatedData() }));
    }
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});
