import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { GoDotFill } from "react-icons/go";
import styles from "./styles.module.scss";

export function Badge({ children, count }: { count?: number; children: React.ReactNode }) {
  return (
    <Box className={styles.root}>
      {count ? (
        <Text as="span" className={styles.count}>
          {count}
        </Text>
      ) : (
        <GoDotFill className={styles.icon} />
      )}
      {children}
    </Box>
  );
}
