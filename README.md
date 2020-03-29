# Fuel Burner Wallet Plugin

This package contains a set of modules to allow any Burner Wallet 2 project to support the
[Fuel Sidechain](https://fuel.sh/).

## Instalation

### New Wallet

If you would like to build your own Burner Wallet powered by Fuel, check out the
[Fuel Burner Wallet starter template](https://github.com/FuelLabs/fuel-burner-wallet).

### Existing Wallet

If you would like to Fuel assets to an existing wallet, first install the package: 

```
yarn add fuel-burner-plugin
```

Next, you can define Asset objects for tokens on the Fuel chain. The `address` property represents
the address of the token on the main chain. `network` is the chain ID of the host chain. Fuel
currently supports Ropsten (3) and Goerli (1), but will eventually support Ethereum Mainnet.

These assets are provided to the Burner Core constructor, alongside any other assets.

Ensure to also add the FuelGateway to the gateways list.

You can optionally add the FuelPlugin as well. This plugin currently is only used to add a "faucet"
button to the wallet, but will provide aditional functionality in the future.

```JSX
...
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import { FuelGateway, FuelAsset, FuelPlugin } from 'fuel-burner-plugin';

const fuelFakeDai = new FuelAsset({
  id: 'fakeDai', 
  name: 'Fuel FakeDai', 
  network: '5', 
  address: '0xCF852d1295fD158D43D58ceD47F88f4f4ab0931C', 
  icon: 'https://static.burnerfactory.com/icons/mcd.svg', 
});

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [new FuelGateway()],
  assets: [fuelFakeDai],
});

const BurnerWallet = () =>
  <ModernUI
    title="Fuel Wallet"
    core={core}
    plugins={[new FuelPlugin({ faucet: 'fakeDai' })]}
  />

```
