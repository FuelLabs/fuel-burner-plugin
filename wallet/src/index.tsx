import React from 'react';
import ReactDOM from 'react-dom';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import { FuelGateway, FuelAsset, FuelPlugin } from 'fuel-burner-plugin';

const fuelFakeDai = new FuelAsset({
  id: 'fakeDai', 
  name: 'Fuel FakeDai', 
  network: '5', 
  address: '0xfed4976b61517a687d866ef4357a67bb89474002', 
  icon: 'https://static.burnerfactory.com/icons/mcd.svg', 
});

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new FuelGateway({ forceFuelNetwork: 'unspecified' }),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
  ],
  assets: [fuelFakeDai],
});

const exchange = new Exchange({
  pairs: [new Uniswap('dai')],
});

const BurnerWallet = () =>
  <ModernUI
    title="Fuel Wallet"
    core={core}
    plugins={[
      exchange,
      new FuelPlugin({ faucet: 'fakeDai' })
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
