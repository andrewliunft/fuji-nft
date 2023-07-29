import {
  Heading,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react"
import { BaseContract, ethers } from "ethers"
import jpycAbi from "../constants/Jpyc.json"
import { useLocation } from "react-router-dom"
import {
  SmartContract,
  Web3Button,
  useChainId,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react"
import { useContext, useState } from "react"
import { buildData } from "../utils/prepareMetaTxData"
import { signMessage } from "../utils/signMessage"
import { AddressesContext, WalletContext } from "../App"
import { fromRpcSig } from "ethereumjs-util"

interface UserState {
  addr: string
}

const User: React.FC = () => {
  const { jpycAddress } = useContext(AddressesContext)
  const chainId = useChainId()
  const location = useLocation()
  const { wallet } = useContext(WalletContext)
  const { addr: userAddr } = location.state as UserState

  const [withdrawalButtonUnClickable, setWithdrawalButtonUnClickable] = useState(true)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [error, setError] = useState(false)

  const { contract: jpycContaract } = useContract(jpycAddress, jpycAbi)
  const { data: releasableJpyc } = useContractRead(jpycContaract, "balanceOf", [userAddr])
  //   if (releasableJpyc && parseInt(releasableJpyc as string) / 1e18 !== 0) {
  //     setWithdrawalButtonUnClickable(false)
  //   }

  const onSendProceeds = async (contract: SmartContract<BaseContract>) => {
    if (!address) {
      setError(true)
      return
    }
    console.log(address)
    const from = userAddr
    const to = address
    const amount = parseInt(releasableJpyc as string).toString()
    const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))
    const data = buildData("JPYC Coin", chainId!, jpycAddress, from, to, amount, nonce)
    const signature = (await signMessage(wallet!, data)) as unknown as string
    var { v, r, s } = fromRpcSig(signature)
    contract.call("transferWithAuthorization", [
      from,
      to,
      amount,
      "0",
      ethers.constants.MaxUint256,
      nonce,
      v.toString(),
      r.toString(),
      s.toString(),
    ])
  }

  return (
    <>
      <Heading as="h4" size="md">
        User Page
      </Heading>
      <Text>Your Wallet: {userAddr}</Text>
      {releasableJpyc ? (
        <Text>Amount of JPYC in Your Wallet: {parseInt(releasableJpyc as string) / 1e18} JPYC</Text>
      ) : (
        <Text>Your wallet does NOT have JPYC</Text>
      )}
      {releasableJpyc && (
        <>
          <Text>Send proceeds to another wallet</Text>
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
              action={async (contract) => await onSendProceeds(contract)}
            >
              Send
            </Web3Button>
          </FormControl>
        </>
      )}
    </>
  )
}
export default User
