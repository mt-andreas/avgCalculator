import { expect } from 'chai';
import { AvgCalculator } from '../src/avgCalculator';

describe('avgCalculator', () => {
  it('should return fee estimates', async () => {
    const avgCalculator = new AvgCalculator();
    const [lastBlockAvg, last5Avg, last30Avg] = await avgCalculator.getAverages();

    expect(lastBlockAvg).to.be.a('number');
    expect(last5Avg).to.be.a('number');
    expect(last30Avg).to.be.a('number');
  });
});