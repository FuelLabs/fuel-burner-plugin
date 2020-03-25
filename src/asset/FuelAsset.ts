export default class FuelAsset {
  constructor({
    address='0x0000000000000000000000000000000000000000',
    pollInterval=POLL_INTERVAL,
    ...params
  }) {
    super({ ...params, type: 'fuel-asset' });
    this.address = address;
    this._pollInterval = pollInterval;
  }

  async _send({ from, to, value }) {
    await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'transfer',
      address: this.address,
      from,
      to,
      value,
    });
  }

  async getBalance(account: string) {
    return await this.core.handleRequest(`${this.network}-fuel`, {
      action: 'balance',
      address: this.address,
      account,
    });
  }
}
