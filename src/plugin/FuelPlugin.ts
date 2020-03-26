import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import FaucetBar from './FaucetBar';

interface ConstructorParams {
  faucet?: string | string[];
}

const isString = (obj: any) => Object.prototype.toString.call(obj) === '[object String]';

export default class FuelPlugin implements Plugin {
  public faucets: string[];

  constructor({ faucet }: ConstructorParams) {
    this.faucets = [];
    if (Array.isArray(faucet)) {
      this.faucets = faucet;
    } else if (isString(faucet)) {
      this.faucets = [faucet!];
    }
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    if (this.faucets.length > 0) {
      pluginContext.addElement('home-middle', FaucetBar);
    }
  }
}
