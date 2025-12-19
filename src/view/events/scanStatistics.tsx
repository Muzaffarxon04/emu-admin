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
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { Loading } from "components/loading";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useQuery, useMutation, useQueryClient } from "react-query";
import eventService from "server/events";
import { AiOutlineBarChart, AiOutlineDownload } from "react-icons/ai";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { formatPhoneNumber } from "hooks/formatPhone";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ScanStatistics({ open, close }: Props) {
  const queryClient = useQueryClient();
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

  const { mutate: addPoints, isLoading: isAddingPoints } = useMutation({
    mutationFn: (data: any) => eventService.addManualPoints(data),
    onSuccess: () => {
      toastSuccess("Баллы успешно начислены!");
      setIsAddPointsModalOpen(false);
      setSelectedUser(null);
      reset();
      queryClient.invalidateQueries(["events_scan_statistics", open?.id]);
    },
    onError: (err: any) => {
      toastError(err?.data?.detail?.detail || err?.data?.detail || "Ошибка при начислении баллов");
    },
  });

  const handleAddPoints = (formData: any) => {
    if (!selectedUser) return;
    
    addPoints({
      user_id: selectedUser.user_id,
      // event_id: open?.id,
      event_id:null,
      points: parseInt(formData.points),
      description: formData.description || "Qo'shimcha faollik uchun",
    });
  };


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


        <ModalFooter gap="21px" p="30px">
          <Btn mode="cancel" onClick={() => close()}>
            Закрыть
          </Btn>
        </ModalFooter>
      </ModalContent>

      {/* Add Points Modal */}
      <Modal
        isOpen={isAddPointsModalOpen}
        onClose={() => {
          setIsAddPointsModalOpen(false);
          setSelectedUser(null);
          reset();
        }}
        isCentered
        size="md"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader p="26px 30px 15px 30px">
            <Text fontSize="24px" fontWeight="700">
              Добавить баллы
            </Text>
          </ModalHeader>
          <form onSubmit={handleSubmit(handleAddPoints)}>
            <ModalBody p="0px 30px 30px 30px">
              {selectedUser && (
                <Box mb="20px" p="15px" bg="#F7FAFC" borderRadius="8px">
                  <Text fontSize="14px" fontWeight="600" color="#718096" mb="5px">
                    Пользователь
                  </Text>
                  <Text fontSize="16px" fontWeight="600">
                    {selectedUser.user_name || "N/A"}
                  </Text>
                  <Text fontSize="13px" color="#718096" mt="5px">
                    {selectedUser.user_phone ? formatPhoneNumber(selectedUser.user_phone) : "N/A"}
                  </Text>
                </Box>
              )}

              <VStack spacing="20px" align="stretch">
                <FormControl isInvalid={!!errors.points}>
                  <FormLabel fontSize="14px" fontWeight="600">
                    Количество баллов
                  </FormLabel>
                  <Input
                    {...register("points", {
                      required: "Введите количество баллов",
                      pattern: {
                        value: /^(?!0|-)\d+$/,
                        message: "Введите положительное число",
                      },
                    })}
                    type="number"
                    placeholder="Введите количество баллов"
                    borderColor="#D9D9D9"
                    h="40px"
                  />
                  {errors.points && (
                    <Text fontSize="12px" color="#ED665E" mt="5px">
                      {errors.points.message as string}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel fontSize="14px" fontWeight="600">
                    Описание
                  </FormLabel>
                  <Input
                    {...register("description", { required: "Введите описание" })}
                    type="text"
                    placeholder="Например: Qo'shimcha faollik uchun"
                    borderColor="#D9D9D9"
                    h="40px"
                  />
                  {errors.description && (
                    <Text fontSize="12px" color="#ED665E" mt="5px">
                      {errors.description?.message as string}
                    </Text>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <Box p="0 30px">
              <Divider border="1px solid #D9D9D9" />
            </Box>
            <ModalFooter gap="21px" p="30px">
              <Btn
                mode="cancel"
                onClick={() => {
                  setIsAddPointsModalOpen(false);
                  setSelectedUser(null);
                  reset();
                }}
                type="button"
              >
                Отмена
              </Btn>
              <Btn mode="send" type="submit" load={isAddingPoints}>
                Добавить
              </Btn>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Modal>
  );
}

