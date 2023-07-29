import Header from "./Header"
import { Banana, Chains } from "@rize-labs/banana-wallet-sdk"
import { useContext, useEffect, useState } from "react"
import { Text } from "@chakra-ui/react"
import { WalletContext } from "../App"

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { wallet, setWallet } = useContext(WalletContext)
  const [walletAddress, setWalletAddress] = useState("")
  const [bananaSdkInstance, setBananSdkInstance] = useState<Banana | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getBananaInstance()
  }, [])

  const getBananaInstance = () => {
    const bananaInstance = new Banana(Chains.shibuyaTestnet)
    setBananSdkInstance(bananaInstance)
  }

  const createWallet = async () => {
    // starts loading
    setIsLoading(true)

    if (!bananaSdkInstance) {
      console.log("You don't have banana sdk instance")
      return
    }
    // creating wallet
    const wallet = await bananaSdkInstance.createWallet()
    setWallet(wallet)

    // getting address for wallet created
    const address = await wallet.getAddress()
    setWalletAddress(address)
    setIsLoading(false)
  }

  const connectWallet = async () => {
    // checking does wallet name is cached in cookie
    if (!bananaSdkInstance) {
      console.log("You don't have banana sdk instance")
      return
    }
    const walletName = bananaSdkInstance.getWalletName()

    // if cached we will use it
    if (walletName) {
      setIsLoading(true)

      // connect wallet with cached wallet name
      const wallet = await bananaSdkInstance.connectWallet(walletName)
      setWallet(wallet)

      // extracting wallet address for display purpose
      const address = await wallet.getAddress()
      setWalletAddress(address)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      alert("You don't have wallet created!")
    }
  }

  return (
    <>
      <Header
        isLoading={isLoading}
        walletAddress={walletAddress}
        createWallet={createWallet}
        connectWallet={connectWallet}
      />
      {walletAddress ? <main>{children}</main> : <Text>Your wallet is not connected!</Text>}
    </>
  )
}

export default Layout
