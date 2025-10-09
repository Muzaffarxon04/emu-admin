import { Box, Button, HStack, Image, Select, Text } from "@chakra-ui/react";
import GrantImg from "assets/image/education.svg";
import EventImg from "assets/image/event.svg";
import NewsImg from "assets/image/new.svg";
import Plus from "assets/image/plus.svg";
import StorestImg from "assets/image/stores.svg";
import { ExportToExcel } from "components/export/ExportToExcel";
import { BsCart2, BsCheck2Square } from "react-icons/bs";
import { FiBook, FiUsers } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";
import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactElement;
  btnDisable?: boolean;
  expoDisable?: boolean;
  btnHidden?: boolean;
  expoHidden?: boolean;
  expoClick?: () => void;
  btnClick?: () => void;
  fileName?: string;
  apiData?: any;
  expoLoad?: boolean;
  setReload?: (e: boolean) => void;
  isActive?: boolean;
  setIsActive?: (e: boolean) => void;
};

const data = [
  {
    title: "События",
    url: "",
    icon: <Image src={EventImg} alt="image event page" />,
  },
  {
    title: "Stories",
    url: "stories",
    icon: <Image src={StorestImg} alt="image event page" />,
  },
  {
    title: "События",
    url: "events",
    icon: <Image src={EventImg} alt="image event page" />,
  },
  {
    title: "Новости",
    url: "news",
    icon: <Image src={NewsImg} alt="image news page" />,
  },
  { title: "Магазин", url: "shop", icon: <BsCart2 color="#46BB0C" size="25" /> },
  { title: "Заявки", url: "applications", icon: <BsCheck2Square color="#46BB0C" size="25" /> },
  { title: "Гранты", url: "grants", icon: <Image src={GrantImg} alt="image grand page" /> },
  { title: "Пользователи", url: "users", icon: <FiUsers color="#46BB0C" size="25" /> },
  { title: "F.A.Q", url: "faq", icon: <FiBook color="#46BB0C" size="25" /> },
  { title: "Справочник", url: "directory", icon: <FiBook color="#46BB0C" size="25" /> },
  { title: "Media", url: "media", icon: <MdOutlinePermMedia color="#46BB0C" size="25" /> },
];

export function GlobalContainer({
  children,
  btnDisable,
  expoDisable,
  btnHidden,
  expoHidden,
  btnClick,
  fileName,
  apiData = [],
  expoLoad,
  setReload,
  isActive,
  setIsActive,
}: Props) {
  const location = useLocation();
  const path = location.pathname.substring(1);

  return (
    <Box
      p={"34px 20px"}
      bg="#F7F8FB"
      h="93vh"
      boxShadow={"0px 4px 10px 0px rgba(117, 117, 117, 0.10) inset"}
    >
      {data
        .filter((j) => j.url === path)
        .map((i, id) => (
          <HStack justifyContent="space-between" key={id}>
            <HStack>
              <Box>{i.icon}</Box>
              <Text fontSize="24px" fontWeight="700">
                {i.title}
              </Text>
            </HStack>
            <HStack>
              <Box hidden={i.url !== "events"}>
                <Select
                  background={"#fff"}
                  border={"none"}
                  boxShadow="0px 6px 18px 0px rgba(0, 0, 0, 0.06)"
                  minW={"130px"}
                  cursor={"pointer"}
                  defaultValue={isActive ? "true" : "false"}
                  onChange={(e) => {
                    setIsActive?.(e.target.value === "true");
                  }}
                >
                  <option value="true">Активный</option>
                  <option value="false">Неактивный</option>
                </Select>
              </Box>
              <Box>
                <ExportToExcel
                  expoDisable={expoDisable}
                  expoHidden={expoHidden}
                  fileName={fileName}
                  apiData={apiData}
                  expoLoad={expoLoad}
                  setReload={setReload}
                />
              </Box>

              <Box>
                <Button
                  disabled={btnDisable}
                  hidden={btnHidden}
                  rightIcon={<Image src={Plus} alt="plus image" />}
                  bg="#46BB0C"
                  border=""
                  boxShadow="0px 6px 18px 0px rgba(0, 0, 0, 0.06)"
                  borderRadius="4px"
                  color="#fff"
                  fontWeight="700"
                  fontSize="16px"
                  padding="8px 16px"
                  _hover={{
                    bg: "#46BB0C",
                    color: "#fff",
                  }}
                  onClick={btnClick}
                >
                  Добавить
                </Button>
              </Box>
            </HStack>
          </HStack>
        ))}

      <Box>{children}</Box>
    </Box>
  );
}
