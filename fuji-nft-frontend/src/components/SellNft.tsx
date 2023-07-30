import {
  Box,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { AddressesContext } from "../App"
import { Web3Button, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import basicnftAbi from "../constants/BasicNft.json"
import marketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

type SellNftProps = {}

const SellNft: React.FC<SellNftProps> = () => {
  const { nftAddress, marketplaceAddress } = useContext(AddressesContext)

  const [tokenId, setTokenId] = useState<string | null>(null)
  const [price, setPrice] = useState<string>("0")
  console.log(ethers.BigNumber.from(ethers.utils.parseUnits(price, 18)))
  const isDisabled = tokenId === null

  const { contract: basicnftContract } = useContract(nftAddress, basicnftAbi)
  const { data: nftAmount } = useContractRead(basicnftContract, "getTokenCounter", [])
  const { mutateAsync: approve } = useContractWrite(basicnftContract, "approve")
  nftAmount && console.log(parseInt(nftAmount as string))

  return (
    <>
      <Heading size="md" mt="5" ml="10">
        Sell Your NFT
      </Heading>
      <Box m="10">
        <Text>Token ID</Text>
        <NumberInput
          width="500px"
          min={0}
          max={nftAmount - 1}
          onChange={(tokenId) => setTokenId(tokenId)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>Price (JPYC)</Text>
        <NumberInput
          width="500px"
          onChange={(price) => setPrice(price)}
          value={price}
          min={0}
          mb={4}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Web3Button
          contractAddress={marketplaceAddress}
          contractAbi={marketplaceAbi}
          action={async (contract) => {
            await approve({ args: [marketplaceAddress, tokenId] })
            contract.call("listItem", [
              nftAddress,
              tokenId,
              ethers.BigNumber.from(ethers.utils.parseUnits(price, 18)),
            ])
          }}
          isDisabled={isDisabled}
          onError={(error) => console.log(error)}
          onSuccess={(result) => {
            console.log(result)
            console.log("success!")
          }}
        >
          Sell
        </Web3Button>
      </Box>
    </>
  )
}
export default SellNft
