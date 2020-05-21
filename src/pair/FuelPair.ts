import { Pair } from '@burner-wallet/exchange';
import FuelAsset from '../asset';

export default class FuelPair extends Pair {
  constructor(assetA: string, assetB: string) {
    super({ assetA, assetB });
  }

  async exchangeAtoB({ account, value, ether }: any) {
    const wad = this._getValue({ value, ether });
    const { tokenA, tokenB } = this.getTokens();

    // @ts-ignore
    await tokenA.core.handleRequest(`${tokenA.network}-fuel`, {
      action: 'swap',
      from: account,
      inputToken: tokenA.address,
      outputToken: tokenB.address,
      amount: wad,
    });
  }

  // TODO: Use ExchangeParams type
  async exchangeBtoA({ account, value, ether }: any) {
    const wad = this._getValue({ value, ether });
    const { tokenA, tokenB } = this.getTokens();

    // @ts-ignore
    await tokenA.core.handleRequest(`${tokenA.network}-fuel`, {
      action: 'swap',
      from: account,
      inputToken: tokenB.address,
      outputToken: tokenA.address,
      amount: wad,
    });
  }

  async estimateAtoB(value: any) {
    const wad = this._getValue(value);
    const { tokenA, tokenB } = this.getTokens();

    // @ts-ignore
    const estimate = await tokenA.core.handleRequest(`${tokenA.network}-fuel`, {
      action: 'rate',
      inputToken: tokenA.address,
      outputToken: tokenB.address,
      amount: wad,
    });
    console.log(estimate);
    return { estimate };
  }

  async estimateBtoA(value: any) {
    const wad = this._getValue(value);
    const { tokenA, tokenB } = this.getTokens();

    // @ts-ignore
    const estimate = await tokenA.core.handleRequest(`${tokenA.network}-fuel`, {
      action: 'rate',
      inputToken: tokenB.address,
      outputToken: tokenA.address,
      amount: wad,
    });
    console.log(estimate);
    return { estimate };
  }

  private getTokens() {
    const tokenA = this.getExchange().getAsset(this.assetA) as FuelAsset;
    const tokenB = this.getExchange().getAsset(this.assetB) as FuelAsset;
    return { tokenA, tokenB };
  }
}
