const dotenv = require('dotenv');
const result = dotenv.config();

import express from 'express';
import { AvgCalculator } from './avgCalculator';


if (result.error) {
  throw result.error;
}

const app = express();
const avgCalculator = new AvgCalculator();

app.get('/feeAverages', async (req, res) => {
  try {
    const [lastBlockAvg, last5Avg, last30Avg] = await avgCalculator.getAverages();
    res.json({ lastBlockAvg, last5Avg, last30Avg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
