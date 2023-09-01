"use client"
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'

const chains = [mainnet, goerli];
const projectId = process.env.PROJECT_ID ?? (() => { throw new Error("PROJECT_ID is not defined"); })();

const { publicClient, webSocketPublicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
    webSocketPublicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

interface WagmiProviderProps {
    children: React.ReactNode
}

export default function WagmiProvider({
    children
}: WagmiProviderProps) {
    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                {children}
                <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeMode='dark' themeVariables={{
                    '--w3m-background-color': '#181818',
                    '--w3m-z-index': '2000'
                }} />
            </WagmiConfig>
        </>
    )
}