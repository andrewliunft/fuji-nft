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
import { AddressesContext } from "../App"
import basicnftAbi from "../constants/BasicNft.json"
import jpycAbi from "../constants/Jpyc.json"
import marketplaceAbi from "../constants/NftMarketplace.json"

type NftBoxProps = {
  seller: string
  price: string
  tokenId: string
}

const NftBox: React.FC<NftBoxProps> = ({ seller, price, tokenId }) => {
  const { nftAddress, jpycAddress, marketplaceAddress } = useContext(AddressesContext)
  const [imageURI, setImageURI] = useState<string>("")
  const [tokenName, setTokenName] = useState<string>("")
  const [tokenDescription, setTokenDescription] = useState<string>("")

  const { contract: nftContract } = useContract(nftAddress, basicnftAbi)
  const { data: tokenURI } = useContractRead(nftContract, "tokenURI", [tokenId])

  const { contract: jpycContract } = useContract(jpycAddress, jpycAbi)
  const { mutateAsync: approve } = useContractWrite(jpycContract, "approve")

  async function updateUI(tokenURI: string) {
    console.log(`The token URI is ${tokenURI}`)

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

  useEffect(() => {
    tokenURI && updateUI(tokenURI)
  }, [tokenURI])

  return (
    <Card width="300px" marginY="10">
      <CardHeader>
        <Heading size="md">{tokenName}</Heading>
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
          {price} JPYC
        </Text>
      </CardBody>
      <Divider />
      <CardFooter>
        <Web3Button
          contractAddress={marketplaceAddress}
          contractAbi={marketplaceAbi}
          action={async (contract) => {
            await approve({
              args: [marketplaceAddress, ((price as unknown as number) * 1e18).toString()],
            })
          }}
        >
          Buy
        </Web3Button>
      </CardFooter>
    </Card>
  )
}
export default NftBox
