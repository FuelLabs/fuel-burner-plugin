import { Asset } from '@burner-wallet/assets';

export default class FuelAsset extends Asset {
  private address: string;

  constructor({
    address='0x0000000000000000000000000000000000000000',
    ...params
  }) {
    // @ts-ignore
    super({ ...params, type: 'fuel-asset' });
    this.address = address;
  }

  async getTx(txHash: string) { 
    // @ts-ignore
    const result = await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'transaction',
      transactionHash: txHash,
    });

    return { 
      asset: this.id, 
      assetName: this.name, 
      from: result.from, 
      to: result.to, 
      value: result.value, 
      displayValue: this.getDisplayValue(result.value), 
      message: null, 
      timestamp: 0,
    };
  } 

  async _send({ from, to, value }: any) {
    // @ts-ignore
    const result = await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'transfer',
      address: this.address,
      from,
      to,
      value,
    });

    return result;
  }

  startWatchingAddress() {
  }

  async getBalance(account: string) {
    // @ts-ignore
    return await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'balance',
      address: this.address, // this is the token
      account,
    });
  }

  async faucet(account: string) {
    // @ts-ignore
    return await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'faucet',
      account,
    });
  }
}
