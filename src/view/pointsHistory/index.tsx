import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { GlobalContainer } from "components/globalContainer";
import { Loading } from "components/loading";
import { ErrorCard } from "components/errorCard";
import { toastError } from "components/toast/popUp";
import { useQuery } from "react-query";
import eventService from "server/events";
import dayjs from "dayjs";
import { useState } from "react";
import Pagination from "components/pagination";

export default function PointsHistory() {
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
  };

  const {
    isLoading,
    isError,
    data: pointsHistoryData,
    refetch,
  } = useQuery<any>({
    queryKey: ["all_points_history", page],
    queryFn: () => eventService.getAllPointsHistory(params),
    onError: (err: any) => toastError(err?.data?.detail?.detail || "Ошибка при загрузке истории баллов"),
  });

  const pointsHistory = pointsHistoryData?.data || [];
  const pagination = pointsHistoryData?.pagination;

  return (
    <GlobalContainer btnHidden={true} expoHidden={true}>
      <VStack spacing="20px" align="stretch">
        <Text fontSize="24px" fontWeight="700">
          История баллов
        </Text>

        {isLoading ? (
          <Box py="40px">
            <Loading />
          </Box>
        ) : isError ? (
          <Box py="40px">
            <ErrorCard onReset={() => refetch()} />
          </Box>
        ) : pointsHistory.length === 0 ? (
          <Box
            bg="#fff"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            pt="100px"
            pb="100px"
            borderRadius="8px"
          >
            <Text fontSize="25px" fontWeight="600" color="#718096">
              История баллов пуста
            </Text>
          </Box>
        ) : (
          <>
            <Box bg="#fff" borderRadius="8px" overflow="hidden">
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="#F7FAFC">
                    <Tr>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                        Дата
                      </Th>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                        Пользователь
                      </Th>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                        Описание
                      </Th>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px" isNumeric>
                        Баллы
                      </Th>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                        Событие
                      </Th>
                      <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                        Создатель
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pointsHistory.map((history: any, index: number) => (
                      <Tr key={history.id || index} _hover={{ bg: "#F7FAFC" }}>
                        <Td fontSize="14px" color="#718096" py="15px">
                          {history.created_at
                            ? dayjs(history.created_at).format("DD.MM.YYYY HH:mm")
                            : "N/A"}
                        </Td>
                        <Td fontSize="14px" fontWeight="600" color="#2D3748" py="15px">
                          {history.user_name || "N/A"}
                        </Td>
                        <Td fontSize="14px" color="#4D4D4D" py="15px">
                          {history.description || "N/A"}
                        </Td>
                        <Td fontSize="14px" fontWeight="600" color="#46BB0C" py="15px" isNumeric>
                          +{history.points || 0}
                        </Td>
                        <Td fontSize="14px" color="#4D4D4D" py="15px">
                          {history.event_name || "N/A"}
                        </Td>
                        <Td fontSize="14px" color="#4D4D4D" py="15px">
                          {history.creator_name || "N/A"}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            {pagination && (
              <Pagination
                paginate={pagination}
                setPage={setPage}
                dataLength={pointsHistory.length}
              />
            )}
          </>
        )}
      </VStack>
    </GlobalContainer>
  );
}

