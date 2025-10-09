import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { PasswordGenerator } from "components/generatePassword";
import { CustomInput } from "components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import userService from "server/user";
import { toastError, toastSuccess } from "components/toast/popUp";
import { shallowEqual, useSelector } from "react-redux";
import { Loading } from "components/loading";
import { Btn } from "components/button";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function Profil({ open, close }: Props) {
  const [show, setShow] = useState<boolean>(false);
  const { user } = useSelector((state: any) => state.auth, shallowEqual);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const checkError = () => {
    const error = Object.keys(errors).length;
    if (error !== 0) return toastError("Произошла ошибка при вводе информации. Проверьте поля.");
  };

  const { isLoading } = useQuery(["events_byId", open], () => userService.getID(user?.id), {
    onSuccess: (res: any) => {
      setValue("first_name", res.first_name);
      setValue("last_name", res.last_name);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: any) => userService.update(user?.id, data),
    onSuccess: () => {
      toastSuccess("Успешно обновлено!");
      reset();
      close();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const formSubmit = (data: any) => {
    const params = {
      ...data,
    };
    edit(params);
  };

  return (
    <Modal isOpen={open} onClose={close} isCentered size={"2xl"}>
      <OverlayOne />
      <form onSubmit={handleSubmit(formSubmit)}>
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"space-between"}>
            <Text color="#000" fontSize="30px" fontWeight="700">
              Профиль
            </Text>
          </ModalHeader>

          <ModalBody>
            {isLoading ? (
              <Loading />
            ) : (
              <Box>
                <CustomInput
                  error={errors}
                  disabled={!show}
                  variant={show ? "outline" : "unstyled"}
                  name={"first_name"}
                  control={control}
                  label={"Имя"}
                />
                <CustomInput
                  error={errors}
                  disabled={!show}
                  name={"last_name"}
                  control={control}
                  label={"Фамилия"}
                  variant={show ? "outline" : "unstyled"}
                  style={{ mt: "15px" }}
                />

                {show && (
                  <Box mt="15px">
                    <PasswordGenerator
                      error={errors}
                      name={"password"}
                      control={control}
                      disabled={!show}
                      setValue={setValue}
                      watch={watch}
                    />
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>

          <ModalFooter gap="21px">
            {show ? (
              <>
                <Btn
                  mode="cancel"
                  onClick={() => {
                    close();
                    reset();
                  }}
                >
                  Нет
                </Btn>
                <Btn load={editLoad} type="submit" mode="send" onClick={checkError}>
                  Да
                </Btn>
              </>
            ) : (
              <Btn onClick={() => setShow(true)} mode="send">
                Изменить
              </Btn>
            )}
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
