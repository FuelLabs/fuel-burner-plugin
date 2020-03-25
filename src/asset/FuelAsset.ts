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

  async _send({ from, to, value }: any) {
    // @ts-ignore
    await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'transfer',
      address: this.address,
      from,
      to,
      value,
    });
  }

  async getBalance(account: string) {
    // @ts-ignore
    return await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'balance',
      address: this.address,
      account,
    });
  }
}
