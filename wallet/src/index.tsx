import React from 'react';
import ReactDOM from 'react-dom';
import { ERC20Asset, NativeAsset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import { FuelGateway, FuelAsset } from 'fuel-burner-wallet';

const fuelFakeDai = new FuelAsset({
  id: 'fakeDai', 
  name: 'Fuel FakeDai', 
  network: '5', 
  address: '0xCF852d1295fD158D43D58ceD47F88f4f4ab0931C', 
  usdPrice: 1, 
  icon: 'https://static.burnerfactory.com/icons/mcd.svg', 
});

const fuelgeth = new FuelAsset({
  id: 'fuelgeth', 
  name: 'Fuel gETH', 
  network: '5', 
});

const goerliFakeDai = new ERC20Asset({
  id: 'goerliFakeDai',
  name: 'Goerli FakeDai',
  network: '5',
  address: '0xCF852d1295fD158D43D58ceD47F88f4f4ab0931C',
  usdPrice: 1,
});

const geth = new NativeAsset({
  id: 'geth',
  name: 'gETH',
  network: '5',
})

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new FuelGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
  ],
  assets: [fuelFakeDai, fuelgeth, goerliFakeDai, geth],
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
