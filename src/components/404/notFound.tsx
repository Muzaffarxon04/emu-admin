
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Center height={"100vh"}>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={"400px"}
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="28px" mt={3} mb={2}>
          Страница не найдена
        </Text>
        <Text color={"gray.500"} mb={6}>
          Страница, которую вы ищете, похоже, не существует.
        </Text>

        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => navigate(-1)}
        >
          Иди домой
        </Button>
      </Box>
    </Center>
  );
};
