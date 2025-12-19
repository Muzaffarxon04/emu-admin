import {
  Box,
  Button,
  IconButton,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Avatar,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { GlobalContainer } from "components/globalContainer";
import { Loading } from "components/loading";
import { ErrorCard } from "components/errorCard";
import { toastError, toastSuccess } from "components/toast/popUp";
import { Btn } from "components/button";
import { formatPhoneNumber } from "hooks/formatPhone";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import eventService from "server/events";
import dayjs from "dayjs";
import { AiOutlineArrowLeft, AiOutlinePlus, AiOutlineHistory } from "react-icons/ai";
import { useState, Fragment } from "react";
import { useForm } from "react-hook-form";

interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  middle_name: string | null;
  phone: string;
  email: string | null;
  balance: number;
  avatar_url: string | null;
  registered_at: string;
  dob: string | null;
  lang: string;
  is_completed_profile: boolean;
}

interface Participant {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  users: User;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const eventId = id ? parseInt(id) : undefined;
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [isPointsHistoryModalOpen, setIsPointsHistoryModalOpen] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<User | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const {
    isLoading,
    isError,
    data: participantsData,
    refetch,
  } = useQuery<any>({
    queryKey: ["event_participants", eventId],
    queryFn: () => eventService.getEventParticipants(eventId),
    onError: (err: any) => toastError(err?.data?.detail?.detail || "Ошибка при загрузке участников"),
    enabled: Boolean(eventId),
  });

  const participants: Participant[] = participantsData?.data || [];

  const { mutate: addPoints, isLoading: isAddingPoints } = useMutation({
    mutationFn: (data: any) => eventService.addManualPoints(data),
    onSuccess: () => {
      toastSuccess("Баллы успешно начислены!");
      setIsAddPointsModalOpen(false);
      setSelectedUser(null);
      reset();
      queryClient.invalidateQueries(["event_participants", eventId]);
    },
    onError: (err: any) => {
      toastError(err?.data?.detail?.detail || err?.data?.detail || "Ошибка при начислении баллов");
    },
  });

  const handleAddPoints = (formData: any) => {
    if (!selectedUser) return;
    
    addPoints({
      user_id: selectedUser.users.id,
      event_id: eventId,
      points: parseInt(formData.points),
      description: formData.description || "Qo'shimcha faollik uchun",
    });
  };

  const openAddPointsModal = (participant: Participant) => {
    setSelectedUser(participant);
    setIsAddPointsModalOpen(true);
  };

  const openPointsHistoryModal = (user: User) => {
    setSelectedUserForHistory(user);
    setIsPointsHistoryModalOpen(true);
  };

  const {
    data: pointsHistoryData,
    isLoading: isPointsHistoryLoading,
  } = useQuery<any>({
    queryKey: ["points_history", selectedUserForHistory?.id],
    queryFn: () => eventService.getPointsHistory(selectedUserForHistory?.id),
    onError: (err: any) => toastError(err?.data?.detail?.detail || "Ошибка при загрузке истории баллов"),
    enabled: Boolean(selectedUserForHistory?.id) && isPointsHistoryModalOpen,
  });

  const pointsHistory = pointsHistoryData?.data || [];

  const getUserFullName = (user: User) => {
    const parts = [user.first_name, user.middle_name, user.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  

  return (
    <Fragment>
      <GlobalContainer
        btnHidden={true}
        expoHidden={true}
      >
      <VStack spacing="20px" align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing="15px">
            <Button
              onClick={() => navigate("/events")}
              leftIcon={<AiOutlineArrowLeft />}
              variant="outline"
              size="md"
            >
              Назад к событиям
            </Button>
            <Text fontSize="24px" fontWeight="700">
              Участники события
            </Text>
          </HStack>
        </HStack>

        {isLoading ? (
          <Box py="40px">
            <Loading />
          </Box>
        ) : isError ? (
          <Box py="40px">
            <ErrorCard onReset={() => refetch()} />
          </Box>
        ) : participants.length === 0 ? (
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
              Участники не найдены
            </Text>
          </Box>
        ) : (
          <Box bg="#fff" borderRadius="8px" overflow="hidden">
            <TableContainer>
              <Table variant="simple">
                <Thead bg="#F7FAFC">
                  <Tr>
              
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Пользователь
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Телефон
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Email
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px" isNumeric>
                      Баланс
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Статус
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Дата регистрации
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Дата заявки
                    </Th>
                    <Th fontSize="14px" fontWeight="700" color="#4D4D4D" py="15px">
                      Действие
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {participants.map((participant) => (
                    <Tr key={participant.id} _hover={{ bg: "#F7FAFC" }}>
                     
                      <Td fontSize="14px" py="15px">
                        <HStack spacing="10px">
                          <Avatar
                            size="sm"
                            src={participant.users.avatar_url || undefined}
                            name={getUserFullName(participant.users)}
                          />
                          <Text fontWeight="600" color="#2D3748">
                            {getUserFullName(participant.users)}
                          </Text>
                        </HStack>
                      </Td>
                      <Td fontSize="14px" color="#4D4D4D" py="15px">
                        {participant.users.phone ? formatPhoneNumber(participant.users.phone) : "N/A"}
                      </Td>
                      <Td fontSize="14px" color="#4D4D4D" py="15px">
                        {participant.users.email || "N/A"}
                      </Td>
                      <Td fontSize="14px" fontWeight="600" color="#46BB0C" py="15px" isNumeric>
                        {participant.users.balance || 0}
                      </Td>
                      <Td fontSize="14px" py="15px">
                        <Badge
                          colorScheme={participant.status === "pending" ? "yellow" : participant.status === "approved" ? "green" : "red"}
                          px="10px"
                          py="4px"
                          borderRadius="4px"
                        >
                          {participant.status}
                        </Badge>
                      </Td>
                      <Td fontSize="14px" color="#718096" py="15px">
                        {participant.users.registered_at
                          ? dayjs(participant.users.registered_at).format("DD.MM.YYYY HH:mm")
                          : "N/A"}
                      </Td>
                      <Td fontSize="14px" color="#718096" py="15px">
                        {participant.created_at
                          ? dayjs(participant.created_at).format("DD.MM.YYYY HH:mm")
                          : "N/A"}
                      </Td>
                      <Td fontSize="14px" py="15px">
                        <HStack spacing="10px">
                          <IconButton
                            aria-label="Добавить баллы"
                            icon={<AiOutlinePlus />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openAddPointsModal(participant)}
                          />
                          <IconButton
                            aria-label="История баллов"
                            icon={<AiOutlineHistory />}
                            size="sm"
                            colorScheme="gray"
                            variant="outline"
                            onClick={() => openPointsHistoryModal(participant.users)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </VStack>
      </GlobalContainer>

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
                  {getUserFullName(selectedUser.users)}
                </Text>
                <Text fontSize="13px" color="#718096" mt="5px">
                  {selectedUser?.users?.phone ? formatPhoneNumber(selectedUser.users.phone) : "N/A"}
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
              minW="150px"
              borderRadius="4px"
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
    </Fragment>
  );
}

