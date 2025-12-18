import {
  Box,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { Loading } from "components/loading";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useQuery, useMutation } from "react-query";
import eventService from "server/events";
import { AiOutlineBarChart, AiOutlineDownload } from "react-icons/ai";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { formatPhoneNumber } from "hooks/formatPhone";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ScanStatistics({ open, close }: Props) {
  const { isLoading, data } = useQuery<any>(
    ["events_scan_statistics", open?.id],
    () => eventService.getScanStatistics(open?.id),
    {
      onError: (err: any) => toastError(err?.data?.detail?.detail),
      enabled: Boolean(open?.id),
    }
  );

  const { mutate: downloadExcel, isLoading: excelLoading } = useMutation({
    mutationFn: () => eventService.getScanStatisticsExcel(open?.id),
    onSuccess: (blob: Blob) => {
      const fileName = `scan-statistics-event-${open?.id || 'event'}.xlsx`;
      saveAs(blob, fileName);
      toastSuccess("Excel файл успешно загружен!");
    },
    onError: (err: any) => {
      toastError(err?.data?.detail?.detail || "Ошибка при загрузке Excel файла");
    },
  });

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <ModalContent>
        <ModalHeader p="26px 30px 15px 30px">
          <HStack justify="space-between">
            <HStack>
              <AiOutlineBarChart size={24} />
              <Text fontSize="30px" fontWeight="700">
                Скан статистика
              </Text>
            </HStack>
            {data?.data && (
              <Button
                colorScheme="green"
                onClick={() => downloadExcel()}
                isLoading={excelLoading}
                leftIcon={<AiOutlineDownload />}
                loadingText="Загрузка..."
                size="md"
              >
                Скачать Excel
              </Button>
            )}
          </HStack>
        </ModalHeader>
        <ModalBody p="0px 30px 30px 30px">
          {isLoading ? (
            <Loading />
          ) : (
            <Box>
              {data?.data ? (
                <VStack spacing="20px" align="stretch">
                  <Box p="20px" bg="#F7FAFC" borderRadius="8px">
                    <Stat>
                      <StatLabel fontSize="16px" fontWeight="600">
                        Общее количество сканирований
                      </StatLabel>
                      <StatNumber fontSize="32px" color="#46BB0C">
                        {data?.data?.total_scans || 0}
                      </StatNumber>
                    </Stat>
                  </Box>

                  <HStack spacing="20px">
                    <Box flex={1} p="20px" bg="#E6F4FF" borderRadius="8px">
                      <Stat>
                        <StatLabel fontSize="14px" fontWeight="500">
                          Уникальные пользователи
                        </StatLabel>
                        <StatNumber fontSize="24px" color="#1890FF">
                          {data?.data?.unique_users || 0}
                        </StatNumber>
                      </Stat>
                    </Box>

                    <Box flex={1} p="20px" bg="#FFF7E6" borderRadius="8px">
                      <Stat>
                        <StatLabel fontSize="14px" fontWeight="500">
                          Всего начислено баллов
                        </StatLabel>
                        <StatNumber fontSize="24px" color="#FA8C16">
                          {data?.data?.total_points_awarded || 0}
                        </StatNumber>
                      </Stat>
                    </Box>
                  </HStack>

                  {data?.data?.recent_scans && data?.data?.recent_scans?.length > 0 && (
                    <Box mt="20px">
                      <Text fontSize="18px" fontWeight="600" mb="15px">
                        Последние сканирования
                      </Text>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Пользователь</Th>
                              <Th>Телефон</Th>
                              <Th>Время сканирования</Th>
                              <Th isNumeric>Баллы</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {data.data.recent_scans.map((scan: any) => (
                              <Tr key={scan.scan_id}>
                                <Td>
                                  <Text fontWeight="500">{scan.user_name || "N/A"}</Text>
                                </Td>
                                <Td>
                                  <Text fontSize="13px" color="#718096">
                                    {scan.user_phone ? formatPhoneNumber(scan.user_phone) : "N/A"}
                                  </Text>
                                </Td>
                                <Td>
                                  <Text fontSize="13px" color="#718096">
                                    {scan.scanned_at
                                      ? dayjs(scan.scanned_at).format("DD.MM.YYYY HH:mm")
                                      : "N/A"}
                                  </Text>
                                </Td>
                                <Td isNumeric>
                                  <Text fontWeight="600" color="#46BB0C">
                                    {scan.points_earned || 0}
                                  </Text>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </VStack>
              ) : (
                <Box textAlign="center" py="40px">
                  <Text fontSize="16px" color="#718096">
                    Нет данных о сканированиях
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </ModalBody>

        <Box p="0 30px">
          <Divider border="1px solid #D9D9D9" />
        </Box>
        <ModalFooter gap="21px" p="30px">
          <Btn mode="cancel" onClick={() => close()}>
            Закрыть
          </Btn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

