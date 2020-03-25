import { Gateway } from '@burner-wallet/core/gateways'

export default class FuelGateway extends Gateway {
  private wallets: { [name: string]: any } = {};

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['3-fuel', '5-fuel'];
  }

  getWallet(network: string, account: string) {
    // @ts-ignore
    console.log('key', this.core.callSigner('readKey', account));

    return null;
  }

  async send(network: string, payload: any) {
    const _network = network.substr(0, network.indexOf('-'));
    const wallet = this.getWallet(_network, payload.account);

    console.log('wallet and payload', wallet, payload);

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
