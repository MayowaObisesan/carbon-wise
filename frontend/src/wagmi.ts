import { metaMask } from "wagmi/connectors";

import { http, createConfig } from "wagmi";
import { liskSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [liskSepolia],
  connectors: [metaMask()],
  transports: {
    [liskSepolia.id]: http(),
  },
});
