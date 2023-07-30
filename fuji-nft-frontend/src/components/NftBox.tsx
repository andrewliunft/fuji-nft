import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react"
import { truncateStr } from "../utils/truncateStr"
import { Web3Button, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { useContext, useEffect, useState } from "react"
import { AddressesContext, WalletContext } from "../App"
import basicnftAbi from "../constants/BasicNft.json"
import jpycAbi from "../constants/Jpyc.json"
import marketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

type NftBoxProps = {
  seller: string
  price: string
  tokenId: string
}

const NftBox: React.FC<NftBoxProps> = ({ seller, price, tokenId }) => {
  const { nftAddress, jpycAddress, marketplaceAddress } = useContext(AddressesContext)
  const { wallet } = useContext(WalletContext)

  const [imageURI, setImageURI] = useState<string>("")
  const [tokenName, setTokenName] = useState<string>("")
  const [tokenDescription, setTokenDescription] = useState<string>("")

  const { contract: nftContract } = useContract(nftAddress, basicnftAbi)
  const { data: tokenURI } = useContractRead(nftContract, "tokenURI", [tokenId])

  const { contract: jpycContract } = useContract(jpycAddress, jpycAbi)
  const { mutateAsync: approve } = useContractWrite(jpycContract, "approve")

  async function updateUI(tokenURI: string) {
    // using the image tag from the tokenURI, get the image
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      const tokenURIResponse = await (await fetch(requestURL)).json()
      const imageURI = tokenURIResponse.image
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      setImageURI(imageURIURL)
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
    }
  }
  console.log(ethers.BigNumber.from((1 * 1e18).toString()))

  useEffect(() => {
    tokenURI && updateUI(tokenURI)
  }, [tokenURI])

  return (
    <Card width="300px" marginY="10" mr="10">
      <CardHeader>
        <Heading size="md">
          {tokenName} #{tokenId}
        </Heading>
      </CardHeader>
      <CardBody>
        <Image src={imageURI} />
        <Text color="blue.600" fontSize="md" mt="2">
          {tokenDescription}
        </Text>
        <Text color="blue.600" fontSize="md">
          Seller: {truncateStr(seller, 15)}
        </Text>
        <Text color="blue.600" fontSize="larger" mt="2">
          {((price as unknown as number) / 1e18).toString()} JPYC
        </Text>
      </CardBody>
      <Divider />
      <CardFooter>
        <Web3Button
          contractAddress={marketplaceAddress}
          contractAbi={marketplaceAbi}
          action={async (contract) => {
            await approve({
              args: [marketplaceAddress, ethers.BigNumber.from((1 * 1e18).toString())],
            })
            contract.call("buyItem", [nftAddress, tokenId])
          }}
          onError={(error) => console.log(error)}
          onSuccess={(result) => {
            console.log(result)
            console.log("success!")
          }}
        >
          Buy
        </Web3Button>
        {/* {userAddr === seller} */}
      </CardFooter>
    </Card>
  )
}
export default NftBox
