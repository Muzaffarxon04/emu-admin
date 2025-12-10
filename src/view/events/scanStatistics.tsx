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
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { Loading } from "components/loading";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useQuery, useMutation } from "react-query";
import eventService from "server/events";
import { AiOutlineBarChart, AiOutlineDownload } from "react-icons/ai";
import { saveAs } from "file-saver";

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
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"2xl"}>
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
                          Уникальные сканирования
                        </StatLabel>
                        <StatNumber fontSize="24px" color="#1890FF">
                          {data?.data?.unique_scans || 0}
                        </StatNumber>
                      </Stat>
                    </Box>

                    <Box flex={1} p="20px" bg="#FFF7E6" borderRadius="8px">
                      <Stat>
                        <StatLabel fontSize="14px" fontWeight="500">
                          Повторные сканирования
                        </StatLabel>
                        <StatNumber fontSize="24px" color="#FA8C16">
                          {(data?.data?.total_scans || 0) - (data?.data?.unique_scans || 0)}
                        </StatNumber>
                      </Stat>
                    </Box>
                  </HStack>

                  {data?.data?.scans_by_date && data?.data?.scans_by_date?.length > 0 && (
                    <Box mt="20px">
                      <Text fontSize="18px" fontWeight="600" mb="15px">
                        Сканирования по датам
                      </Text>
                      <VStack spacing="10px" align="stretch">
                        {data.data.scans_by_date.map((item: any, index: number) => (
                          <Box
                            key={index}
                            p="15px"
                            bg="white"
                            border="1px solid #E2E8F0"
                            borderRadius="8px"
                          >
                            <HStack justify="space-between">
                              <Text fontSize="14px" fontWeight="500">
                                {item.date || "N/A"}
                              </Text>
                              <Text fontSize="16px" fontWeight="600" color="#46BB0C">
                                {item.count || 0} сканирований
                              </Text>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {data?.data?.last_scan && (
                    <Box mt="20px" p="15px" bg="#F0F9FF" borderRadius="8px">
                      <Text fontSize="14px" fontWeight="500" mb="5px">
                        Последнее сканирование
                      </Text>
                      <Text fontSize="16px" fontWeight="600">
                        {data.data.last_scan}
                      </Text>
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

