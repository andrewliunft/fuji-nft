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
import { ethers } from "ethers"
import { contractAddressesInterface } from "../types/networkAddress"
import networkConfig from "../constants/networkMapping.json"
import jpycAbi from "../constants/Jpyc.json"
import { useLocation } from "react-router-dom"
import { useChainId, useContract, useContractRead } from "@thirdweb-dev/react"
import { useContext, useState } from "react"
import { buildData } from "../utils/prepareMetaTxData"
import { signMessage } from "../utils/signMessage"
import { WalletContext } from "../App"
import { fromRpcSig } from "ethereumjs-util"

interface UserState {
  addr: string
}

const User: React.FC = () => {
  const location = useLocation()
  const { wallet } = useContext(WalletContext)
  const { addr: userAddr } = location.state as UserState

  const [withdrawalButtonUnClickable, setWithdrawalButtonUnClickable] = useState(true)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [error, setError] = useState(false)

  const chainId = useChainId()
  const addresses: contractAddressesInterface = networkConfig
  const jpycAddress = chainId ? addresses[chainId]["Jpyc"][0] : ""

  const { contract: jpycContaract } = useContract(jpycAddress, jpycAbi)
  const { data: releasableJpyc } = useContractRead(jpycContaract, "balanceOf", [userAddr])
  if (releasableJpyc && ethers.utils.formatUnits(parseInt(releasableJpyc as string)) !== "0.0") {
    setWithdrawalButtonUnClickable(false)
  }

  const onSendProceeds = async () => {
    if (!address) {
      setError(true)
      return
    }
    const from = userAddr
    const to = address
    const amount = parseInt(releasableJpyc as string).toString()
    const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))
    const data = buildData("JPYC Coin", chainId!, jpycAddress, from, to, amount, nonce)
    const signature = (await signMessage(wallet!, data)) as unknown as string
    var { v, r, s } = fromRpcSig(signature)
  }

  return (
    <>
      <Heading as="h4" size="md">
        User Page
      </Heading>
      {releasableJpyc ? (
        <Text>
          Amount of JPYC in Your Wallet:{" "}
          {ethers.utils.formatEther(parseInt(releasableJpyc as string))} JPYC
        </Text>
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
            <Button isDisabled={withdrawalButtonUnClickable} top="-0.5" onClick={onSendProceeds}>
              Send
            </Button>
          </FormControl>
        </>
      )}
    </>
  )
}
export default User
