import {
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Divider,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useLocation } from "react-router-dom"
import { Web3Button, useChainId, useContract, useContractRead } from "@thirdweb-dev/react"
import { useContext, useState } from "react"
import { buildData } from "../utils/prepareMetaTxData"
import { signMessage } from "../utils/signMessage"
import { AddressesContext, WalletContext } from "../App"
import { fromRpcSig } from "ethereumjs-util"
import jpycAbi from "../constants/Jpyc.json"
import marketplaceAbi from "../constants/NftMarketplace.json"

interface UserState {
  addr: string
}

const User: React.FC = () => {
  const { jpycAddress, marketplaceAddress } = useContext(AddressesContext)
  const chainId = useChainId()
  const location = useLocation()
  const { wallet } = useContext(WalletContext)
  const { addr: userAddr } = location.state as UserState

  const [withdrawalButtonUnClickable, setWithdrawalButtonUnClickable] = useState(true)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [error, setError] = useState(false)

  const { contract: jpycContaract } = useContract(jpycAddress, jpycAbi)
  const { data: releasableJpyc } = useContractRead(jpycContaract, "balanceOf", [userAddr])

  const { contract: marketplaceContract } = useContract(marketplaceAddress, marketplaceAbi)
  const { data: proceeds } = useContractRead(marketplaceContract, "getProceeds", [userAddr])

  return (
    <>
      <Heading as="h4" size="md">
        User Page
      </Heading>
      <Text>Your Wallet: {userAddr}</Text>
      <Divider marginY="5" />
      <Heading size="sm">Withdraw Proceeds</Heading>
      <Text>Proceeds: {parseInt(proceeds as string) / 1e18} JPYC</Text>
      <Web3Button
        contractAddress={marketplaceAddress}
        contractAbi={marketplaceAbi}
        action={(contract) => {
          contract.call("withdrawProceeds", [])
        }}
        onSuccess={() => console.log("success!")}
        onError={(error) => console.log(error)}
      >
        Withdraw
      </Web3Button>
      <Divider marginY="5" />
      {releasableJpyc ? (
        <>
          <Heading size="5">Send proceeds to another wallet</Heading>
          <Text>
            Amount of JPYC in Your Wallet: {parseInt(releasableJpyc as string) / 1e18} JPYC
          </Text>
        </>
      ) : (
        <Text>Your wallet does NOT have JPYC</Text>
      )}
      {releasableJpyc && (
        <>
          <FormControl isInvalid={error}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              value={address}
              width="500px"
              onChange={(e) => setAddress(e.target.value)}
            />
            {!error ? (
              <FormHelperText>Enter the address you'd like to receive JPYC.</FormHelperText>
            ) : (
              <FormErrorMessage>Address is required.</FormErrorMessage>
            )}
            <Web3Button
              contractAddress={jpycAddress}
              contractAbi={jpycAbi}
              action={async (contract) => {
                if (!address) {
                  setError(true)
                  return
                }
                console.log(address)
                const from = userAddr
                const to = address
                const amount = releasableJpyc
                const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))
                const data = buildData("JPYC Coin", chainId!, jpycAddress, from, to, amount, nonce)
                const signature = await signMessage(wallet!, data)
                console.log(signature.signature)
                const v = "0x" + signature.signature.slice(130, 132)
                const r = signature.signature.slice(0, 66)
                const s = "0x" + signature.signature.slice(66, 130)
                console.log(v, r, s)
                contract.call("transferWithAuthorization", [
                  from,
                  to,
                  amount,
                  "0",
                  (Math.floor(Date.now() / 1000) + 3600).toString(),
                  nonce,
                  v,
                  r,
                  s,
                ])
              }}
            >
              Send
            </Web3Button>
            {/* <Web3Button
              contractAddress={jpycAddress}
              contractAbi={jpycAbi}
              action={(contract) => {
                contract.call("transfer", [address, releasableJpyc])
              }}
              onSuccess={() => console.log("success!")}
              onError={(error) => console.log(error)}
            >
              Send
            </Web3Button> */}
          </FormControl>
        </>
      )}
    </>
  )
}
export default User
