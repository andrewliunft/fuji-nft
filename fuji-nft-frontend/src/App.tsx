import { Routes, Route, BrowserRouter } from "react-router-dom"
import "./App.css"
import Layout from "./components/Layout"
import Home from "./components/Home"
import User from "./components/User"
import { ThirdwebSDKProvider } from "@thirdweb-dev/react"
import { createContext, useState } from "react"
import { Wallet } from "@rize-labs/banana-wallet-sdk"

export const WalletContext = createContext<{
  wallet: Wallet | null
  setWallet: React.Dispatch<React.SetStateAction<Wallet | null>>
}>({ wallet: null, setWallet: () => {} })

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null)

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
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
              <Route path="/sell-nft" Component={Home} />
              <Route path="/user" element={<User />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThirdwebSDKProvider>
    </WalletContext.Provider>
  )
}

export default App
