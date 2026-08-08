import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem';

export const inkMainnet = defineChain({
  id: 57073,
  name: 'Ink Mainnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-gel.inkonchain.com'] },
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://explorer.inkonchain.com' },
  },
});

export const config = createConfig({
  chains: [inkMainnet],
  transports: {
    [inkMainnet.id]: http(),
  },
});

// آدرس پروکسی دپلوی‌شده خود روی شبکه اصلی را اینجا وارد کنید
export const INK_VAULT_PROXY_ADDRESS = "0x3030948c02820981db7B3C9BA8A3dDddaDE2B4f8";
export const INK_VAULT_IMPLEMENTATION_ADDRESS = "0x704F5Cce388B05d75d349Ff93496dC29254bB5Fc";