import { Box } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  url: string;
  path: string;
};
export default function NavItem(props: Props) {
  const { children, url, path } = props;

  return (
    <NavLink to={url}>
      <Box
        as="span"
        h={"65px"}
        px={"12px"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        fontSize={"18px"}
        fontWeight={url === path ? "700" : '500'}
        bg={url === path ? "#ECFFD8" : ""}
        color={url === path ? "#46BB0C" : ""}
        _hover={{
          textDecoration: "none",
          bg: "#ECFFD8",
          color: "#46BB0C",
        }}
      >
        {children}
      </Box>
    </NavLink>
  );
}
