// src/utils/esgDataManager.cjs
// CommonJS version for use in Node.js server environments

const esgData = {
  scores: {
    environmental: 82,
    social: 75,
    governance: 88,
    frameworks: {
      gri: { progress: 85, status: 'compliant' },
      sasb: { progress: 90, status: 'compliant' },
      tcfd: { progress: 78, status: 'on-track' },
      csrd: { progress: 65, status: 'on-track' },
      sbti: { progress: 50, status: 'in-progress' },
      cdp: { progress: 72, status: 'in-progress' },
      issb: { progress: 60, status: 'in-progress' },
      sdg: { progress: 80, status: 'on-track' },
      pcaf: { progress: 40, status: 'in-progress' },
    },
  },
};

const getScores = () => {
  // In a real app, this would fetch from a database or live API
  // For this mock, we return a deep copy to prevent mutation
  return JSON.parse(JSON.stringify(esgData.scores));
};

module.exports = {
  getScores,
};

