import { Box, HStack, Text } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

const UploadButton = () => {
  return (
    <HStack flexDirection='column' justifyContent={'center'}>
      <Box>
        <AiOutlinePlus color="#000"/>
      </Box>
      <Text color="#000">добавить</Text>
    </HStack>
  );
};

export default UploadButton;
