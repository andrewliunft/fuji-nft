import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

type HeaderProps = {
  isLoading: boolean
  walletAddress: string
  createWallet: () => void
  connectWallet: () => void
}

export const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return

  const separator = "..."
  const separatorLen = separator.length
  const charsToShow = strLen - separatorLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return (
    fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
  )
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
          <Link to="/user" state={{ addr: walletAddress }}>
            <Box border="1px" borderRadius="5" borderColor="whiteAlpha.800" p="2">
              <Text fontWeight="bold" color="whiteAlpha.800">
                {truncateStr(walletAddress, 15)}
              </Text>
            </Box>
          </Link>
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
