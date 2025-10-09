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
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { CustomInput } from "components/input";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useMutation, useQuery } from "react-query";
import userService from "server/user";
import { Loading } from "components/loading";
import { PasswordGenerator } from "components/generatePassword";
import Phone from "components/phone/phone";
import { useState } from "react";

type Props = {
  open: any;
  close: () => void;
  refetch: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function AddUser({ open, close, refetch }: Props) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const checkError = () => {
    const error = Object.keys(errors).length;
    if (error !== 0) return toastError("Произошла ошибка при вводе информации. Проверьте поля.");
  };

  const { isLoading } = useQuery(["user_byId", open?.id], () => userService.getID(open?.id), {
    onSuccess: (res: any) => {
      setValue("first_name", res.first_name);
      setValue("last_name", res.last_name);
      setValue("phone", res.phone);
    },
    onError: (err: any) => err?.data?.detail?.detail,
    enabled: Boolean(open?.id),
  });

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: () => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: any) => userService.update(open?.id, data),
    onSuccess: () => {
      toastSuccess("Успешно обновлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const formSubmit = (data: any) => {
    const params = {
      ...data,
    };
    if (open?.id) edit(params);
    else add(params);
  };

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <form onSubmit={handleSubmit(formSubmit)}>
        <ModalContent>
          <ModalHeader p="26px 30px 15px 30px">
            <HStack justify="space-between">
              <Text fontSize="30px" fontWeight="700">
                {open?.id ? "Редактировать пользователи" : "Добавить пользователи"}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalBody p="0px 30px 30px 30px">
            {isLoading ? (
              <Loading />
            ) : (
              <Box>
                <CustomInput error={errors} name={"first_name"} control={control} label={"Имя"} />

                <CustomInput
                  error={errors}
                  name={"last_name"}
                  control={control}
                  label={"Фамилия"}
                  style={{ mt: "15px" }}
                />
                <Box mt={"25px"}>
                  <Phone
                    error={errors}
                    name={"phone"}
                    control={control}
                  />
                </Box>

                <Box mt="15px">
                  <PasswordGenerator
                    error={errors}
                    name={"password"}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    disabled={open?.id}
                    required={open?.id && false}
                  />
                </Box>
              </Box>
            )}
          </ModalBody>

          <Box p="0 30px">
            <Divider border="1px solid #D9D9D9" />
          </Box>
          <ModalFooter gap="21px" p="30px">
            <Btn
              mode="cancel"
              onClick={() => {
                close();
                reset();
              }}
            >
              Отмена
            </Btn>
            <Btn
              load={open?.id ? editLoad : addLoad}
              type="submit"
              mode="send"
              onClick={checkError}
            >
              Сохранить
            </Btn>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
