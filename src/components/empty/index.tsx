import { Box, Text } from "@chakra-ui/react";
import { TbMoodEmpty } from "react-icons/tb";

export default function CustomNoRowsOverlay() {
  return (
    <Box bg='#fff' borderRadius='5px' h='300px' w='100wh' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <TbMoodEmpty color="#46BB0C" size={100}/>
      <Text fontSize='18px' fontWeight='500'>нет данных</Text>
    </Box>
  );
}
