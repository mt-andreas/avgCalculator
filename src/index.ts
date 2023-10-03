import express from 'express';
import { FeeEstimator } from './feeEstimator';

const app = express();
const feeEstimator = new FeeEstimator();

app.get('/feeEstimate', async (req, res) => {
  try {
    const [lastBlockAvg, last5Avg, last30Avg] = await feeEstimator.getFeeEstimates();
    res.json({ lastBlockAvg, last5Avg, last30Avg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
