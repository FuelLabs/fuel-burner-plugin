import React from 'react';
import ReactDOM from 'react-dom';
import { dai, eth } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import { FuelGateway, FuelAsset } from 'fuel-burner-wallet';

const fuelFakeDai = new FuelAsset({
  id: 'fakeDai', 
  name: 'FakeDai', 
  network: '3', 
  address: '0x6b175474e89094c44da98b954eedeac495271d0f', 
  usdPrice: 1, 
  icon: 'https://static.burnerfactory.com/icons/mcd.svg', 
});

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new FuelGateway(),
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
  ],
  assets: [fuelFakeDai, dai, eth],
});

const exchange = new Exchange({
  pairs: [new Uniswap('dai')],
});

const BurnerWallet = () =>
  <ModernUI
    title="Fuel Wallet"
    core={core}
    plugins={[exchange]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
