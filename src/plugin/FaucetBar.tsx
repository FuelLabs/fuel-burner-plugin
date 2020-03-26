import React, { useState, useEffect } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import FuelPlugin from './FuelPlugin';
import FuelAsset from '../asset';

const Container = styled.div`
  margin: 4px 0;
  background: #EEEEEE;
  display: flex;
`;

const ENSPanel: React.FC<PluginElementContext> = ({ defaultAccount, plugin, assets, BurnerComponents }) => {
  const [loading, setLoading] = useState(false);
  const _plugin = plugin as FuelPlugin;

  const request = async (asset: Asset) => {
    setLoading(true);
    await (asset as FuelAsset).faucet(defaultAccount);
    setLoading(false);
  };

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
