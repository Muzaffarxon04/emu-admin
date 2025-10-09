import { Text } from "@chakra-ui/react";

type Props = {
  children: any;
  type?: number;
};

export function HelperText({ children, type = 1 }: Props) {
  return (
    <Text
      fontSize="12px"
      fontWeight="400"
      color="#ED665E"
      position="absolute"
      left={0}
      bottom={type === 1 ? "-18px" : "-38px"}
    >
      {children}
    </Text>
  );
}
