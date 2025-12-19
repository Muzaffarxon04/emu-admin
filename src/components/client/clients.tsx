import { Button, HStack, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Box, Text, VStack, Input, FormControl, FormLabel, Table, TableContainer, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlinePlus, AiOutlineHistory } from "react-icons/ai";
import { DataTable } from "components/dataTable";
import { ShowClient } from "./show";
import userService from "server/user";
import { useQuery, useMutation } from "react-query";
import { MasterResponse } from "types/master.types";
import { formatPhoneNumber } from "hooks/formatPhone";
import { useForm } from "react-hook-form";
import eventService from "server/events";
import { toastError, toastSuccess } from "components/toast/popUp";
import { Btn } from "components/button";
import { Loading } from "components/loading";
import { ErrorCard } from "components/errorCard";
import dayjs from "dayjs";

type Props = {
  setFile: (e: any) => void;
  setReload: (e: boolean) => void;
  reload: boolean;
};

export function Clients({ setFile, reload, setReload }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isPointsHistoryModalOpen, setIsPointsHistoryModalOpen] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const params = {
    page: page,
    limit: 10,
    role: "user",
  };

  const { isLoading, isError, refetch, data } = useQuery<any>({
    queryKey: ["users_getAll", page],
    queryFn: () => userService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["users_export", page],
    queryFn: () => userService.getAll({ role: "user" }),
    enabled: reload,
  });

  const { mutate: addPoints, isLoading: isAddingPoints } = useMutation({
    mutationFn: (data: any) => eventService.addManualPoints(data),
    onSuccess: () => {
      toastSuccess("Баллы успешно начислены!");
      setIsAddPointsModalOpen(false);
      setSelectedUser(null);
      reset();
      refetch();
    },
    onError: (err: any) => {
      toastError(err?.data?.detail?.detail || err?.data?.detail || "Ошибка при начислении баллов");
    },
  });

  const handleAddPoints = (formData: any) => {
    if (!selectedUser) return;
    
    addPoints({
      event_id: null,
      user_id: selectedUser.id,
      points: parseInt(formData.points),
      description: formData.description || "Qo'shimcha faollik uchun",
    });
  };

  const openAddPointsModal = (user: any) => {
    setSelectedUser(user);
    setIsAddPointsModalOpen(true);
  };

  const openPointsHistoryModal = (user: any) => {
    setSelectedUserForHistory(user);
    setIsPointsHistoryModalOpen(true);
  };

  const {
    data: pointsHistoryData,
    isLoading: isPointsHistoryLoading,
    isError: isPointsHistoryError,
    refetch: refetchPointsHistory,
  } = useQuery<any>({
    queryKey: ["points_history", selectedUserForHistory?.id],
    queryFn: () => eventService.getPointsHistory(selectedUserForHistory?.id),
    onError: (err: any) => toastError(err?.data?.detail?.detail || "Ошибка при загрузке истории баллов"),
    enabled: Boolean(selectedUserForHistory?.id) && isPointsHistoryModalOpen,
  });

  const pointsHistory = pointsHistoryData?.data || [];

  const getUserFullName = (user: any) => {
    const parts = [user.first_name, user.middle_name, user.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  const columns = [
    {
      field: "first_name",
      headerName: "Имя",
    },
    {
      field: "last_name",
      headerName: "Фамилия",
    },
    {
      field: "middle_name",
      headerName: "Отчество",
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: MasterResponse) => formatPhoneNumber(String(data.phone)),
    },
    {
      field: "email",
      headerName: "E-mail",
    },
    {
      field: "city",
      headerName: "Город",
      renderCell: (data: MasterResponse) => data.cities?.name_ru,
    },
    {
      field: "dob",
      headerName: "Дата рождения",
    },
    {
      field: "study_in",
      headerName: "Место учебы",
    },
    {
      field: "job",
      headerName: "Место работы",
    },
    {
      field: "balance",
      headerName: "Баланс",
      renderCell: (data: MasterResponse) => data.balance || 0,
    },
    {
      field: "system",
      headerName: "",
      width: "200px",
      renderCell: (data: MasterResponse) => (
        <HStack gap={0}>
          <IconButton
          style={{marginRight: "8px"}}
            aria-label="Добавить баллы"
            icon={<AiOutlinePlus />}
            size="sm"
            colorScheme="green"
            onClick={() => openAddPointsModal(data)}
          />
          <IconButton
            aria-label="История баллов"
            icon={<AiOutlineHistory />}
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => openPointsHistoryModal(data)}
          />
          <Button
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
            onClick={() => setShow(data)}
          >
            <AiOutlineEye size={18} />
          </Button>
        </HStack>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: any) => ({
        Имя: i.first_name,
        Фамилия: i.last_name,
        Отчество: i.middle_name,
        "E-mail": i.email,
        "Номер телефона": i.phone,
        Город: i.cities?.name_ru,
        "Дата рождения": i.dob,
        "Место учебы": i.study_in,
        "Место работы": i.job,
        Баланс: i.balance || 0,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        rows={data?.data || []}
        select={selectedIds}
        setSelect={setSelectedIds}
        paginate={data?.pagination}
        setPage={setPage}
        page={page}
        refetch={refetch}
        error={isError}
      />
      {show && <ShowClient open={show} close={() => setShow(false)} />}
      
      {/* Add Points Modal */}
      <Modal
        isOpen={isAddPointsModalOpen}
        onClose={() => {
          if (!isAddingPoints) {
            setIsAddPointsModalOpen(false);
            setSelectedUser(null);
            reset();
          }
        }}
        closeOnOverlayClick={!isAddingPoints}
        closeOnEsc={!isAddingPoints}
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
                    {getUserFullName(selectedUser)}
                  </Text>
                  <Text fontSize="13px" color="#718096" mt="5px">
                    {selectedUser?.phone ? formatPhoneNumber(selectedUser.phone) : "N/A"}
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
                      {errors.points?.message as string}
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
              <Button
                type="submit"
                isLoading={isAddingPoints}
                loadingText="Добавление..."
                colorScheme="green"
                bg="#46BB0C"
                color="white"
                fontWeight="700"
                fontSize="16px"
                px="24px"
                py="8px"
                borderRadius="4px"
                minW="150px"
                _hover={{ bg: "#46BB0C" }}
              >
                Добавить
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Points History Modal */}
      <Modal
        isOpen={isPointsHistoryModalOpen}
        onClose={() => {
          setIsPointsHistoryModalOpen(false);
          setSelectedUserForHistory(null);
        }}
        isCentered
        size="xl"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader p="26px 30px 15px 30px">
            <Text fontSize="24px" fontWeight="700">
              История баллов
            </Text>
            {selectedUserForHistory && (
              <Text fontSize="14px" fontWeight="500" color="#718096" mt="5px">
                {getUserFullName(selectedUserForHistory)}
              </Text>
            )}
          </ModalHeader>
          <ModalBody p="0px 30px 30px 30px">
            {isPointsHistoryLoading ? (
              <Box py="40px">
                <Loading />
              </Box>
            ) : isPointsHistoryError ? (
              <Box py="40px">
                <ErrorCard onReset={() => refetchPointsHistory()} />
              </Box>
            ) : pointsHistory.length === 0 ? (
              <Box
                bg="#fff"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                pt="60px"
                pb="60px"
                borderRadius="8px"
              >
                <Text fontSize="18px" fontWeight="600" color="#718096">
                  История баллов пуста
                </Text>
              </Box>
            ) : (
              <Box>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                          Дата
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
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pointsHistory.map((history: any, index: number) => (
                        <Tr key={index} _hover={{ bg: "#F7FAFC" }}>
                          <Td fontSize="14px" color="#718096" py="15px">
                            {history.created_at
                              ? dayjs(history.created_at).format("DD.MM.YYYY HH:mm")
                              : "N/A"}
                          </Td>
                          <Td fontSize="14px" color="#4D4D4D" py="15px">
                            {history.description || "N/A"}
                          </Td>
                          <Td fontSize="14px" fontWeight="600" color="#46BB0C" py="15px" isNumeric>
                            +{history.points || 0}
                          </Td>
                          <Td fontSize="14px" color="#4D4D4D" py="15px">
                            {history.event_name_ru || history.event_name_uz || history.event_name_en || history.event_name || "N/A"}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </ModalBody>
          <ModalFooter gap="21px" p="30px">
            <Btn mode="cancel" onClick={() => {
              setIsPointsHistoryModalOpen(false);
              setSelectedUserForHistory(null);
            }}>
              Закрыть
            </Btn>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
