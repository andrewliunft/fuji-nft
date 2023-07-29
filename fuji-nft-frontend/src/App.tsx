import { Routes, Route, BrowserRouter } from "react-router-dom"
import "./App.css"
import Layout from "./components/Layout"
import Home from "./components/Home"
import User from "./components/User"
import SellNft from "./components/SellNft"
import { ThirdwebSDKProvider, useChainId, useContract, useContractRead } from "@thirdweb-dev/react"
import { createContext, useState } from "react"
import { Wallet } from "@rize-labs/banana-wallet-sdk"
import { contractAddressesInterface } from "./types/networkAddress"
import networkConfig from "./constants/networkMapping.json"
import basicnftAbi from "./constants/BasicNft.json"

export const WalletContext = createContext<{
  wallet: Wallet | null
  setWallet: React.Dispatch<React.SetStateAction<Wallet | null>>
}>({ wallet: null, setWallet: () => {} })

export const AddressesContext = createContext<{
  nftAddress: string
  jpycAddress: string
  marketplaceAddress: string
}>({
  nftAddress: "",
  jpycAddress: "",
  marketplaceAddress: "",
})

export const NftAmountContext = createContext<{ nftAmount: number }>({ nftAmount: 0 })

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const chainId = useChainId()
  const addresses: contractAddressesInterface = networkConfig
  const nftAddress = chainId ? addresses[chainId]["BasicNft"][0] : ""
  const jpycAddress = chainId ? addresses[chainId]["Jpyc"][0] : ""
  const marketplaceAddress = chainId ? addresses[chainId]["NftMarketplace"][0] : ""

  const { contract: basicnftContract } = useContract(nftAddress, basicnftAbi)
  const { data: nftAmount } = useContractRead(basicnftContract, "getTokenCounter", [])
  nftAmount && console.log(parseInt(nftAmount as string))

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <AddressesContext.Provider value={{ nftAddress, jpycAddress, marketplaceAddress }}>
        <NftAmountContext.Provider value={{ nftAmount: parseInt(nftAmount as string) }}>
          <ThirdwebSDKProvider
            activeChain={{
              chainId: 81,
              rpc: ["https://evm.shibuya.astar.network"],
              name: "Shibuya Testnet",
              chain: "Shibuya",
              testnet: true,
              shortName: "shibuya",
              slug: "shibuya",
              nativeCurrency: {
                decimals: 18,
                name: "SBY",
                symbol: "SBY",
              },
            }}
            signer={wallet?.getSigner()}
          >
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" Component={Home} />
                  <Route path="/sell-nft" Component={SellNft} />
                  <Route path="/user" element={<User />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ThirdwebSDKProvider>
        </NftAmountContext.Provider>
      </AddressesContext.Provider>
    </WalletContext.Provider>
  )
}

export default App
