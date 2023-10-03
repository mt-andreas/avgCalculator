import { expect } from 'chai';
import { FeeEstimator } from '../src/feeEstimator';

describe('FeeEstimator', () => {
  it('should return fee estimates', async () => {
    const feeEstimator = new FeeEstimator();
    const [lastBlockAvg, last5Avg, last30Avg] = await feeEstimator.getFeeEstimates();

    expect(lastBlockAvg).to.be.a('number');
    expect(last5Avg).to.be.a('number');
    expect(last30Avg).to.be.a('number');
  });
});