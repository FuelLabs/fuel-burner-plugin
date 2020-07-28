import { Gateway } from '@burner-wallet/core/gateways';
import { Wallet } from '@fuel-js/wallet';

interface FuelGatewayOptions {
  forceFuelNetwork?: string;
}

export default class FuelGateway extends Gateway {
  private wallet: any;
  private transactionDB: any;
  private forceFuelNetwork?: string;

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
          from: payload.account,
          to: payload.to,
          asset: payload.address,
          value: payload.value,
        });

        return {
          transactionHash: '0x',
          txHash: '0x',
          // id: transferData.unsignedTransaction.hash,
          // transactionHash: transferData.unsignedTransaction.hash,
          // txHash: transferData.unsignedTransaction.hash,
        };

      case 'balance':
        return this.getBalance(_network, payload.account, payload.address);

      // case 'transaction':
      //   const result = fuel.utils.RLP.decode(await this.transactionDB
      //     .get('0xaaaa' + payload.transactionHash.slice(2)));

      //   return {
      //     from: wallet.address,
      //     value: result[0],
      //     address: result[1],
      //     to: result[2],
      //     timestamp: result[3],
      //   };

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
      wallet = new Wallet(null, { address: account });
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
