declare module 'fuel-core' { 
  export { utils } from 'ethers';

  export class Wallet {
    constructor(options: {
      signer: any,
      provider?: any,
      db?: any,
      chainId?: any,
    });
    deposit(amount: any, token: string, options?: any): Promise<any>;
    withdraw(amount: any, token: string, options?: any): Promise<any>;
    retrieve(token: string): Promise<any>;
    balance(token: string): Promise<any>;
    sync(): Promise<any>;
    faucet(): Promise<any>;
    public tokens: { [name:string]: string };
  }

  class Index {}
  class Memory {}
  class Level {}

  export const dbs: { Index: Index, Memory: Memory, Level: Level };
  export const providers: any;
} 

/*

import { Wallet, utils, dbs } from "fuel-core";

const { deposit, balance, withdraw, retrieve, tokens } = new Wallet({
  signer: utils.SigningKey(utils.randomBytes(32)),
  provider: window.web3.currentProvider,
  db: new dbs.Index(),
  chainId: 3, // default is 3 Ropsten (only supported)
});

await deposit(1000, tokens.ether);

console.log(await balance(tokens.ether));

await withdraw(500, tokens.ether); // make a withdrawal UTXO

await retrieve(tokens.ether); // wait 1 weeks, select withdrawal zero or first withdrawal in DB to retrieve [, withdrawlIndex]
*/
