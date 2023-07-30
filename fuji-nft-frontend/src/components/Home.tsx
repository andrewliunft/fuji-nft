import { Box, Flex, Heading } from "@chakra-ui/react"
import { Web3Button } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { AddressesContext, WalletContext } from "../App"
import basicnftAbi from "../constants/BasicNft.json"
import marketplaceAbi from "../constants/NftMarketplace.json"
import NftBox from "./NftBox"

type HomeProps = {}

type ListedNftData = {
  price: string
  seller: string
}

const Home: React.FC<HomeProps> = () => {
  const { wallet } = useContext(WalletContext)
  const { nftAddress, marketplaceAddress } = useContext(AddressesContext)
  const [nftAmount, setNftAmount] = useState<number>(0)
  const [listedNfts, setListedNfts] = useState<ListedNftData[]>([])

  const checkIsListedNft = async (tokenId: string) => {
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      marketplaceAbi,
      wallet?.getProvider()
    )
    const listedNft = await marketplaceContract.getListed(nftAddress, tokenId)
    console.log(listedNft.price)
    return { price: parseInt(listedNft.price as string).toString(), seller: listedNft.seller }
  }

  useEffect(() => {
    const getNftAmount = async () => {
      const basicnftContract = new ethers.Contract(nftAddress, basicnftAbi, wallet?.getProvider())
      const nftAmount = await basicnftContract.getTokenCounter()
      setNftAmount(nftAmount.toNumber())
    }
    getNftAmount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const listedNfts = await Promise.all(
        Array.from({ length: nftAmount }, (_, index) => index).map(
          async (tokenIndex) => await checkIsListedNft(tokenIndex.toString())
        )
      )
      setListedNfts(listedNfts)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftAmount])
  console.log(listedNfts)

  return (
    <>
      <Box mt="5" ml="10">
        <Heading size="md">Listed NFTs</Heading>
        <Flex>
          {listedNfts.map((listedNft, index) => {
            if (listedNft.seller !== ethers.constants.AddressZero) {
              return (
                <NftBox
                  seller={listedNft.seller}
                  price={listedNft.price}
                  tokenId={index.toString()}
                  key={index}
                />
              )
            }
          })}
        </Flex>
        <Web3Button
          contractAddress={nftAddress}
          contractAbi={basicnftAbi}
          action={(contract) => {
            contract.call("mintNft")
          }}
          onError={(error) => console.log(error)}
          onSuccess={(result) => console.log("success!")}
        >
          mint nft
        </Web3Button>
      </Box>
    </>
  )
}
export default Home
