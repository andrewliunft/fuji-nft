import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { truncateStr } from "../utils/truncateStr"

type HeaderProps = {
  isLoading: boolean
  walletAddress: string
  createWallet: () => void
  connectWallet: () => void
}

const Header: React.FC<HeaderProps> = ({
  isLoading,
  walletAddress,
  createWallet,
  connectWallet,
}) => {
  return (
    <Flex justify="center" align="center" width="100%" height="75px" bg="blue.300">
      <Flex width="90%">
        <Link to="/">
          <Heading color="white">FUJI NFT</Heading>
        </Link>
        <Spacer />
        {walletAddress ? (
          <>
            <Link to="/sell-nft">
              <Box mr="20" mt="1">
                <Text fontWeight="semibold" fontSize="17pt" color="whiteAlpha.900">
                  Sell NFT
                </Text>
              </Box>
            </Link>
            <Link to="/user" state={{ addr: walletAddress }}>
              <Box border="1px" borderRadius="5" borderColor="whiteAlpha.900" p="2">
                <Text fontWeight="bold" color="whiteAlpha.900">
                  {truncateStr(walletAddress, 15)}
                </Text>
              </Box>
            </Link>
          </>
        ) : (
          <>
            <Button isLoading={isLoading} onClick={createWallet} mr="5">
              Create Wallet
            </Button>
            <Button isLoading={isLoading} onClick={connectWallet}>
              Connect Wallet
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Header
