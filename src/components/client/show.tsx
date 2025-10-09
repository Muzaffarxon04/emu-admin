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
import LanguageChange from "components/languages-change";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import userService from "server/user";
import { Loading } from "components/loading";
import { toastError } from "components/toast/popUp";
import Phone from "components/phone/phone";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowClient({ open, close }: Props) {

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(["user_byId", open?.id], () => userService.getID(open?.id), {
    onSuccess: (res: any) => {
      setValue("first_name", res?.first_name);
      setValue("last_name", res?.last_name);
      setValue("middle_name", res?.middle_name);
      setValue("phone", res?.phone);
      setValue("email", res?.email);
      setValue("city", res?.cities?.name_ru);
      setValue("birthday", res?.dob);
      setValue("study", res?.study_in);
      setValue("job", res?.work_in);
      setValue("phone", res.phone);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <ModalContent>
        <ModalHeader p="26px 30px 15px 30px">
          <HStack justify="space-between">
            <Text fontSize="30px" fontWeight="700">
              Просмотр пользователи
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
        <ModalBody p="0px 30px 30px 30px">
          {isLoading ? (
            <Loading />
          ) : (
            <Box>
              <HStack>
                <CustomInput
                  error={errors}
                  name={"first_name"}
                  control={control}
                  label={"Имя"}
                  variant="unstyled"
                  disabled
                />
                <CustomInput
                  error={errors}
                  name={"last_name"}
                  control={control}
                  label={"Фамилия"}
                  variant="unstyled"
                  disabled
                />
                <CustomInput
                  error={errors}
                  name={"middle_name"}
                  control={control}
                  label={"Отчество"}
                  variant="unstyled"
                  disabled
                />
              </HStack>

              <HStack mt="15px">
                <Box mt={"15px"} w="100%">
                  <Phone error={errors} name={"phone"} control={control} variant="unstyled" />
                </Box>
                <CustomInput
                  error={errors}
                  name={"email"}
                  control={control}
                  label={"E-mail"}
                  style={{ mt: "15px" }}
                  variant="unstyled"
                  disabled
                />
              </HStack>

              <HStack mt="15px">
                <CustomInput
                  error={errors}
                  name={"city"}
                  control={control}
                  label={"Город"}
                  style={{ mt: "15px" }}
                  variant="unstyled"
                  disabled
                />
                <CustomInput
                  error={errors}
                  name={"birthday"}
                  control={control}
                  label={"Дата рождения"}
                  style={{ mt: "15px" }}
                  variant="unstyled"
                  disabled
                />
              </HStack>

              <HStack mt="15px">
                <CustomInput
                  error={errors}
                  name={"study"}
                  control={control}
                  label={"Место учебы"}
                  style={{ mt: "15px" }}
                  variant="unstyled"
                  disabled
                />
                <CustomInput
                  error={errors}
                  name={"job"}
                  control={control}
                  label={"Место работы"}
                  style={{ mt: "15px" }}
                  variant="unstyled"
                  disabled
                />
              </HStack>
            </Box>
          )}
        </ModalBody>

        <Box p="0 30px">
          <Divider border="1px solid #D9D9D9" />
        </Box>
        <ModalFooter gap="21px" p="30px">
          <Btn mode="send" onClick={() => close()}>
            Подтвердить
          </Btn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
