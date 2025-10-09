import { Box, Checkbox, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { ReactComponent as EmptyData } from "assets/image/noData2.svg";
import { ErrorCard } from "components/errorCard";
import { Loading } from "components/loading";
import Pagination from "components/pagination";
import React from "react";

type Paginate = {
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_items: number;
  total_pages: number;
};

type Props = {
  error?: any;
  setPage?: any;
  page?: number;
  setSelect: any;
  rows: object[];
  select: number[];
  columns: object[];
  loading?: boolean;
  refetch?: () => void;
  paginate?: Paginate;
  disableFooter?: boolean;
};

export function DataTable({
  columns,
  rows,
  error,
  select,
  setSelect,
  loading,
  paginate,
  setPage,
  disableFooter,
  refetch,
}: Props) {
  const dataLength = rows.length;

  const toggleSelect = (id: any) => {
    if (select?.includes(id)) {
      setSelect(select?.filter((selectedId: any) => selectedId !== id));
    } else {
      setSelect([...select, id]);
    }
  };

  const handleSelectAll = () => {
    if (select?.length === rows?.length) {
      setSelect([]);
    } else {
      setSelect(rows?.map((item: any) => item.id));
    }
  };

  return (
    <>
      <Box overflow={"auto"} bg="#F7F8FB" w="100%" pt="34px">
        <Table mb="10px">
          <Thead bg="#fff" h="52px" mt={10} w="100%" zIndex={9999}>
            <Tr>
              <Th p={"12px 15px"}>
                <Checkbox
                  size="md"
                  colorScheme="green"
                  borderColor="#D9D9D9"
                  isChecked={select?.length === rows?.length}
                  onChange={handleSelectAll}
                />
              </Th>
              {(dataLength === 0 ? columns?.slice(0, -1) : columns)?.map(
                (column: any, id: number) => (
                  <Th
                    p={"0px 10px"}
                    display={column?.disabled ? "none" : "table-cell"}
                    fontWeight={700}
                    fontSize="14px"
                    maxW={column?.width || "100px"}
                    minW={column?.minW || "100px"}
                    key={id + "columns"}
                  >
                    {dataLength === 0 ? column?.headerName : column?.headerName}
                  </Th>
                )
              )}
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map((id: number) => (
                <Tr key={id}>
                  <Td pl={0} pr={0} colSpan={columns.length}>
                    <Loading />
                  </Td>
                </Tr>
              ))
            ) : error ? (
              <Tr>
                <Td pl={0} pr={0} colSpan={columns.length}>
                  <ErrorCard onReset={() => refetch?.()} />
                </Td>
              </Tr>
            ) : dataLength === 0 ? (
              <Tr>
                <Td pl={0} pr={0} colSpan={columns.length}>
                  <Box
                    bg="#fff"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    pt={"100px"}
                    pb={"100px"}
                  >
                    <EmptyData width="200px" height="200px" />
                    <Text fontSize="25px" fontWeight="600" mt="30px">
                      К сожалению, результаты не найдены.
                    </Text>
                  </Box>
                </Td>
              </Tr>
            ) : (
              rows?.map((item: any, idx: number) => (
                <React.Fragment key={idx + "rows"}>
                  <Tr bg="#F7F8FB" height={"10px"} />
                  <Tr bg="#fff" h="54px">
                    <Td p={"12px 15px"} w={0}>
                      <Checkbox
                        size="md"
                        colorScheme="green"
                        borderColor="#D9D9D9"
                        isChecked={select?.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </Td>
                    {columns?.map((column: any, index: number) => (
                      <Td
                        p={column.end ? 0 : "0px 10px"}
                        fontWeight={index === 0 ? 700 : 500}
                        fontSize="14px"
                        color="#4D4D4D"
                        maxW={column?.width || "200px"}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        position={column?.end ? "sticky" : "static"}
                        right={0}
                        h="100%"
                        bg="#ffff"
                        textOverflow="ellipsis"
                        key={column?.field + index}
                      >
                        {column?.renderCell ? column?.renderCell(item) : item[column?.field]}
                      </Td>
                    ))}
                  </Tr>
                </React.Fragment>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      {error || loading || dataLength === 0 || disableFooter ? null : (
        <Pagination dataLength={dataLength} paginate={paginate} setPage={setPage} />
      )}
    </>
  );
}
