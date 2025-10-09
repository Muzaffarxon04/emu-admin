import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

type Props = {
  size?: string;
};

export function Loading({ size = "xl" }: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" h="300px">
      <Spinner size={size} color="#46BB0C" speed="0.65s" />
    </Box>
  );
}
