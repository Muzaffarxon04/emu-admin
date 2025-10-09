import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import AvatarImg from "assets/image/avatar.svg";
import Logo from "assets/image/logo.svg";
import TextImg from "assets/image/ziyoApp.svg";
import { Links } from "./data";
import NavItem from "./navLink";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import { Profil } from "components/profil";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { clearUser } from "redux/slices/auth";

export function Header() {
  const location = useLocation();
  const path = location.pathname.substring(1);
  const [open, setOpen] = useState<any>()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth, shallowEqual);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box bg={"#fff"} px={"16px"}>
      <Flex h={"65px"} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={"49px"} alignItems={"center"}>
          <Link to="/">
            <HStack cursor="pointer">
              <Image width="34px" src={Logo} alt="header logo" />
              <Image width="76px" src={TextImg} alt="text logo" />
            </HStack>
          </Link>

          <HStack as={"nav"} display={"flex"} gap={0}>
            {Links.map((link, id) => (
              <NavItem url={link.url} key={id} path={path}>
                {link.title}
              </NavItem>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton as={Button} rounded={"full"} variant={"div"} cursor={"pointer"} minW={0}>
              <Avatar size={"sm"} src={AvatarImg} />
            </MenuButton>
            <MenuList mt={2}>
              <MenuItem
                color={"#46BB0C"}
                fontWeight={900}
                fontSize={"14px"}
                gap={"10px"}
                alignItems={"center"}
              >
                <AiOutlineMail size={20} /> {user?.email}
              </MenuItem>
              <MenuItem onClick={() => setOpen(true)} gap={"10px"} fontWeight={500} fontSize={"14px"} alignItems={"center"}>
                <IoSettingsOutline color="#C0C0C0" size={20} />
                Настройки
              </MenuItem>
              <MenuItem onClick={handleLogout} gap={"10px"} fontWeight={500} fontSize={"14px"} alignItems={"center"}>
                <MdOutlineLogout color="#C0C0C0" size={20} />
                Выйти
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {open && <Profil open={open} close={() => setOpen(false)} />}
    </Box>
  );
}
