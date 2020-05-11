import { Gateway } from '@burner-wallet/core/gateways';
import fuel from 'fuel-core';

export default class FuelGateway extends Gateway {
  private wallet: any;
  private transactionDB: any;

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['3-fuel', '5-fuel'];
  }

  async getWallet(network: string, account: string) {
    // setup wallet
    if (!this.wallet) {
      // @ts-ignore
      const privateKey: string = this.core.callSigner('readKey', account);

      // HACK: this should be fixed in fuel-core
      // @ts-ignore
      const provider = this.core.getProvider(network);
      const send = provider.sendAsync.bind(provider);
      provider.sendAsync = (payload: any, cb: any) => {
        if (payload.method === 'eth_call' && payload.params.length === 1) {
          payload.params.push('latest');
        }
        return send(payload, cb);
      }

      this.wallet = new fuel.Wallet({
        signer: new fuel.utils.SigningKey(privateKey),
        chainId: network,
        provider,
      });

      // @ts-ignore
      this.transactionDB = new fuel.dbs.Index();

      // sync first..
      await this.wallet.sync();

      // auto balance updates.. lol.
      await this.wallet.listen(async () => {
        console.log('updated');
      });
    }

    return this.wallet;
  }

  async send(network: string, payload: any) {
    const _network = network.substr(0, network.indexOf('-'));
    const wallet = await this.getWallet(_network, payload.account);

    switch (payload.action) {
      case 'transfer':
        const transferData = await wallet
          .transfer(payload.value, payload.address, payload.to);

        // Write tx hash to db
        await this.transactionDB
          .put('0xaaaa' + transferData.unsignedTransaction.hash.slice(2), fuel.utils.RLP.encode([
          fuel.utils.bigNumberify(payload.value).toHexString(),
          payload.address,
          payload.to,
          fuel.utils.bigNumberify(Math.floor((new Date()).getTime() / 1000)).toHexString(),
        ]));

        return {
          id: transferData.unsignedTransaction.hash,
          transactionHash: transferData.unsignedTransaction.hash,
          txHash: transferData.unsignedTransaction.hash,
        };

      case 'balance':
        return (await wallet.balance(payload.address)).toString();

      case 'transaction':
        const result = fuel.utils.RLP.decode(await this.transactionDB
          .get('0xaaaa' + payload.transactionHash.slice(2)));

        return {
          from: wallet.address,
          value: result[0],
          address: result[1],
          to: result[2],
          timestamp: result[3],
        };

      case 'faucet':
        await wallet.faucet();
        return;

      default:
        throw new Error(`[FuelGateway] Invalid action ${payload.action}`);
    }
  }
}
