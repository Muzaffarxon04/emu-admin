import { Box, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { GlobalContainer } from "components/globalContainer";
import { Orders } from "components/orders";
import { Category } from "components/category";
import { Products } from "components/products";
import { Badge } from "components/badge";
import { useQuery } from "react-query";
import orderService from "server/order";

export default function Shop() {
  const [current, setCurrent] = useState<number>(0);
  const [add, setAdd] = useState(false);
  const [file, setFile] = useState();
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
  };

  const {
    isLoading,
    isError,
    refetch: orderRefetch,
    data: orderData,
  } = useQuery<any>({
    queryKey: ["orders_getAll", page],
    queryFn: () => orderService.getAll(params),
  });

  const list = [
    {
      title: "Товары",
      page: (
        <Products
          reload={reload}
          setReload={setReload}
          add={add}
          setAdd={setAdd}
          setFile={setFile}
        />
      ),
    },
    {
      title: "Категории",
      page: (
        <Category
          reload={reload}
          setReload={setReload}
          add={add}
          setAdd={setAdd}
          setFile={setFile}
        />
      ),
    },
    {
      title: "Заявки/ Покупатели",
      page: (
        <Orders
          setFile={setFile}
          reload={reload}
          setPage={setPage}
          page={page}
          setReload={setReload}
          isError={isError}
          refetch={orderRefetch}
          data={orderData}
          isLoading={isLoading}
        />
      ),
    },
  ];

  return (
    <GlobalContainer
      btnHidden={current === 2}
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
              borderBottom={
                Number(current) === Number(id) ? "3px solid #46BB0C" : "3px solid #ECFFD8"
              }
              onClick={() => setCurrent(id)}
            >
              {id === 2 && orderData?.count_new_status !== 0 ? (
                <Badge count={orderData?.count_new_status}>{i.title}</Badge>
              ) : (
                i.title
              )}
            </Box>
          ))}
        </HStack>

        <Box h={"75vh"}>{list[current].page}</Box>
      </>
    </GlobalContainer>
  );
}
