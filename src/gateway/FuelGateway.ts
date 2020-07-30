import { Gateway } from '@burner-wallet/core/gateways';
import { Wallet } from '@fuel-js/wallet';

interface FuelGatewayOptions {
  forceFuelNetwork?: string;
}

interface Transaction {
  transactionHash: string;
  txHash: string;
  network: string;
  from: string;
  to: string;
  address: string;
  value: string;
  timestamp: number;
}

export default class FuelGateway extends Gateway {
  private wallet: any;
  private transactionDB: any;
  private forceFuelNetwork?: string;
  private transactions: Transaction[] = [];

  constructor(options: FuelGatewayOptions = {}) {
    super();
    this.forceFuelNetwork = options.forceFuelNetwork;
  }

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['3-fuel', '4-fuel', '5-fuel'];
  }

  start() {}

  async getWallet(network: string, account: string) {
    // setup wallet
    if (!this.wallet) {
      // HACK: this should be fixed in fuel-core
      // @ts-ignore

      const provider = this.core.getProvider(network/*, { simple: network == '0' }*/);
      // const send = provider.sendAsync.bind(provider);
      // provider.sendAsync = (payload: any, cb: any) => {
      //   if (payload.method === 'eth_call' && payload.params.length === 1) {
      //     payload.params.push('latest');
      //   }
      //   return send(payload, cb);
      // }

      this.wallet = new Wallet(provider, {
        network: this.forceFuelNetwork || network,
      });

      this.wallet.on('input');
    }

    return this.wallet;
  }

  async send(network: string, payload: any) {
    const _network = network.substr(0, network.indexOf('-'));
    // const wallet = await this.getWallet(_network, payload.account);

    switch (payload.action) {
      case 'transfer':
        const tx = this.transfer({
          network: _network,
          from: payload.from,
          to: payload.to,
          asset: payload.address,
          value: payload.value,
        });

        const transaction: Transaction = {
          transactionHash: this.transactions.length.toString(),
          txHash: this.transactions.length.toString(),
          network: _network,
          from: payload.from,
          to: payload.to,
          address: payload.address,
          value: payload.value,
          timestamp: Date.now() / 1000,
        };

        this.transactions.push(transaction);

        return transaction;

      case 'balance':
        return this.getBalance(_network, payload.account, payload.address);

      case 'transaction':
        const id = parseInt(payload.transactionHash);
        return this.transactions[id] || null;

      // case 'swap':
      //   await wallet.swap(payload.amount, payload.inputToken, payload.outputToken);
      //   return;

      // case 'rate':
      //   const output = await wallet.rate(payload.amount, payload.inputToken, payload.outputToken);
      //   return output.toString();

      case 'faucet':
        const wallet = await this.getWallet(_network, payload.account);
        await wallet.faucet();
        return;

      default:
        throw new Error(`[FuelGateway] Invalid action ${payload.action}`);
    }
  }

  async getBalance(network: string, account: string, asset: string) {
    let wallet = this.wallet;
    if (!wallet || wallet.address !== account) {
      wallet = new Wallet(null, {
        address: account,
        network: this.forceFuelNetwork || network,
      });
    }

    const balance = await wallet.balance(asset);
    // wallet.off();
    return balance.toString();
  }

  async transfer(tx: { network: string, from: string, to: string, asset: string, value: string }) {
    const wallet = await this.getWallet(tx.network, tx.from);
    await wallet.transfer(tx.asset, tx.to, tx.value);
    return {}; //TODO
  }
}
