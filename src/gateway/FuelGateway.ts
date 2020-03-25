export default class FuelGateway {
  private wallets: { [string: name]: any } = {};

  constructor() {}

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['3-fuel', '5-fuel'];
  }

  send(network, payload) {
    const _network = network.substr(0, network.indexOf('-'));
    const wallet = this.getWallet(_network);

    switch (payload.action) {
      case 'transfer':
        break;
      case 'balance':
        wallet
      default:
        throw new Error(`[FuelGateway] Invalid action ${payload.action}`);
    }
  }
}
