import Web3 from 'web3';

export class AvgCalculator {
  private web3: Web3;
  private transactionCount : number;
  private lastBlockAvgFee : number;
  private last5Avg: number;
  private last30Avg: number;

  //private last5Totals: {TotalFee: number; totalTxs: number }[];
  private last30Totals: { TotalFee: number; totalTxs: number }[];
  constructor() {
    console.log('Starting to listen for blocks...');
    this.web3 = new Web3('wss://goerli.infura.io/ws/v3/9746fa8e8e6b4f31b2315aca21a39f71');
    this.subscribeToNewBlocks();
    this.transactionCount = 0;
    this.lastBlockAvgFee = 0;
    this.last5Avg = 0;
    this.last30Avg = 0;
    //this.last5Totals = [];
    this.last30Totals = [];
  }

  private async subscribeToNewBlocks() {
    const newBlocksSubscription = await this.web3.eth.subscribe('newBlockHeaders');

    newBlocksSubscription.on('data', async blockhead => {
       
        this.handleNewBlock(Number(blockhead.number));
    });

    newBlocksSubscription.on('error', error =>
        console.log('Error when subscribing to New block header: ', error),
    );
    
  }

  private async handleNewBlock(blockNumber: number) {
    this.transactionCount = 0;
    const block = await this.web3.eth.getBlock(blockNumber);
    const totalFee = await this.calculateAvgTotalFee(block);
    console.log(`Stats for block: ${blockNumber}`);
    console.log(`Total fee: ${totalFee} ether`);
    console.log(`Total gas used: ${block.gasUsed}`);
    console.log(`Base Fee: ${this.web3.utils.fromWei(Number(block.baseFeePerGas), "ether")} ether`);
    console.log('*************');


  }

  private async calculateAvgTotalFee(block: any): Promise<number> {
    let TotalFee = 0;
    try{
        if (block.transactions.length > 0) {
          await Promise.all(block.transactions.map(async (tx: any) => {
              this.transactionCount++;
              const value = (await this.web3.eth.getTransaction(tx)).value;
              if (Number(value) > 0){ //only calculate fees for eth transactions
                const data = await this.web3.eth.getTransactionReceipt(tx);
                TotalFee += Number(data.effectiveGasPrice) * Number(data.gasUsed);
              }
          }));
        }
    }
    catch(e){
        console.log(e);
    }

    //this.last5Totals.push({TotalFee: TotalFee, totalTxs: this.transactionCount}); //not ideal
    //if(this.last5Totals.length > 5) this.last5Totals.shift();

    this.last30Totals.push({TotalFee: TotalFee, totalTxs: this.transactionCount});
    if(this.last30Totals.length > 30) this.last30Totals.shift(); //keep the last 30 blocks of data
   
    this.lastBlockAvgFee = TotalFee  / 1e18 / this.transactionCount;

    return this.lastBlockAvgFee;
  }

  public async getAverages(): Promise<number[]> {
    let total = 0;
    let tx = 0;
    
    for (let i =  this.last30Totals.length - 1; i >= 0; i--) {
        total += this.last30Totals[i].TotalFee;
        tx += this.last30Totals[i].totalTxs;
      
        if (this.last30Totals.length - i <= 5) {
          this.last5Avg = total / 1e18 / tx;
        }
      }
      
    this.last30Avg = total / 1e18 / tx;

    return [this.lastBlockAvgFee, this.last5Avg, this.last30Avg];
  }

}
