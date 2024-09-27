import { createConfig, http } from "wagmi";
import { liskSepolia } from "viem/chains";
import { metaMask } from "wagmi/connectors";

console.log(liskSepolia);

export const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    metaMask(),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
});
