import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex justify="center" align="center" width="100%" height="75px" bg="gray">
      <Flex width="90%">
        <Heading color="white">FUJI NFT</Heading>
        <Spacer />
        <Button>Login</Button>
      </Flex>
    </Flex>
  );
};

export default Header;
