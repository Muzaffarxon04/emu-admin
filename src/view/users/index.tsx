import { Box, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { GlobalContainer } from "components/globalContainer";
import { UserComponent } from "components/userComponents";
import { Clients } from "components/client";
import { Administrator } from "components/administrator";

export default function Users() {
  const [current, setCurrent] = useState<number>(0);
  const [add, setAdd] = useState<any>(false);
  const [file, setFile] = useState();
  const [reload, setReload] = useState(false);

  const list = [
    {
      title: "Мастера",
      page: (
        <UserComponent
          reload={reload}
          setReload={setReload}
          add={add}
          setAdd={setAdd}
          setFile={setFile}
          file={file}
        />
      ),
    },
    { title: "Клиенты", page: <Clients reload={reload} setReload={setReload} setFile={setFile} /> },
    {
      title: "Администраторы",
      page: (
        <Administrator
          reload={reload}
          setReload={setReload}
          add={add}
          setAdd={setAdd}
          setFile={setFile}
        />
      ),
    },
  ];

  return (
    <GlobalContainer
      btnHidden={current === 1}
      btnClick={() => setAdd(true)}
      fileName={list[current].title}
      apiData={file}
      setReload={setReload}
    >
      <>
        <HStack mt="20px">
          {list.map((i, id) => (
            <Box
              key={id}
              bg="#ECFFD8"
              padding="12px 34px"
              color="#46BB0C"
              fontSize="14px"
              fontWeight={700}
              cursor="pointer"
              borderBottom={current === id ? "3px solid #46BB0C" : "3px solid #ECFFD8"}
              onClick={() => setCurrent(id)}
            >
              {i.title}
            </Box>
          ))}
        </HStack>

        <Box h={"75vh"}>{list[current].page}</Box>
      </>
    </GlobalContainer>
  );
}
