import { Card, CardBody, Heading, Text } from "@chakra-ui/react";

type NftBoxProps = {};

const NftBox: React.FC<NftBoxProps> = () => {
  return (
    <Card>
      <CardBody>
        <Heading size="md">Living room Sofa</Heading>
        <Text color="blue.600" fontSize="2xl">
          $450
        </Text>
        <Text color="blue.600" fontSize="2xl">
          Seller
        </Text>
      </CardBody>
    </Card>
  );
};
export default NftBox;
