// import { configureChains, createConfig } from "wagmi";
// import { liskSepolia } from "viem/chains";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { alchemyProvider } from "wagmi/providers/alchemy";

// import { publicProvider } from "wagmi/providers/public";

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [
//     liskSepolia,
//     ...(import.meta.env?.MODE === "development" ? [liskSepolia] : []),
//   ],
//   [
//     alchemyProvider({ apiKey: "ix0-fxmVivwaIWYHtIpwVZB7wC8TpxEm" }),
//     publicProvider(),
//   ]
// );

// console.log(liskSepolia);

// export const config = createConfig({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({ chains }),
//     // new CoinbaseWalletConnector({
//     //   chains,
//     //   options: {
//     //     appName: "wagmi",
//     //   },
//     // }),
//     // new InjectedConnector({
//     //   chains,
//     //   options: {
//     //     name: "Injected",
//     //     shimDisconnect: true,
//     //   },
//     // }),
//   ],
//   publicClient,
//   webSocketPublicClient,
// });

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, liskSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, liskSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})