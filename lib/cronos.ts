import { createConfig, http } from 'wagmi'
import { cronosTestnet } from 'viem/chains'

export const cronosConfig = createConfig({
  chains: [cronosTestnet],
  transports: {
    [cronosTestnet.id]: http('https://evm-t3.cronos.org')
  }
})
