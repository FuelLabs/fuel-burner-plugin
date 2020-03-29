import React, { useState, useEffect } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import FuelPlugin from './FuelPlugin';
import FuelAsset from '../asset';

const REQUEST_TIMEOUT = 12 * 60 * 60 * 1000;

const Container = styled.div`
  margin: 4px 0;
  display: flex;
  justify-content: center;
`;

const ENSPanel: React.FC<PluginElementContext> = ({ defaultAccount, plugin, assets, BurnerComponents }) => {
  const lastRequested = parseInt(localStorage.getItem('fuel-faucet-date') || '0');

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(!lastRequested || Date.now() - lastRequested > REQUEST_TIMEOUT);
  const _plugin = plugin as FuelPlugin;

  const request = async (asset: Asset) => {
    setLoading(true);
    try {
      await (asset as FuelAsset).faucet(defaultAccount);
      localStorage.setItem('fuel-faucet-date', Date.now().toString());
      setHidden(true);
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  };

  if (hidden) {
    return null;
  }

  const { Button } = BurnerComponents;
  const faucetAssets = assets.filter((asset: Asset) => _plugin.faucets.indexOf(asset.id) !== -1);
  return (
    <Container>
      {faucetAssets.map((asset: Asset) => (
        <Button disabled={loading} onClick={() => request(asset)}>Request {asset.name}</Button>
      ))}
    </Container>
  );
};

export default ENSPanel;
