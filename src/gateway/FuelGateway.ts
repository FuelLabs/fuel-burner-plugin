export default class FuelGateway {
  private wallets: { [name: string]: any } = {};

  constructor() {}

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['3-fuel', '5-fuel'];
  }

  getWallet(network: string) {
    return null;
  }

  send(network: string, payload: any) {
    const _network = network.substr(0, network.indexOf('-'));
    const wallet = this.getWallet(_network);

    switch (payload.action) {
      case 'transfer':
        break;
      case 'balance':
        break;
      default:
        throw new Error(`[FuelGateway] Invalid action ${payload.action}`);
    }
  }
}
