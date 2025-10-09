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
import { Loading } from "components/loading";
import { useQuery } from "react-query";
import userService from "server/user";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowAdmin({ open, close }: Props) {
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(
    ['user_byId', open?.id],
    () => userService.getID(open?.id),
    {
      onSuccess: (res: any) => {
        setValue('first_name', res.first_name)
        setValue('last_name', res.last_name)
        setValue('email', res.email)
      },
      onError: (err: any) => (err?.data?.detail?.detail),
      enabled: Boolean(open?.id)
    }
  );

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
          {isLoading ? <Loading /> :
            <Box>
              <CustomInput
                error={errors}
                name={"first_name"}
                control={control}
                label={"Имя"}
              />

              <CustomInput
                error={errors}
                name={"last_name"}
                control={control}
                label={"Фамилия"}
                style={{ mt: "15px" }}
              />
              <CustomInput
                error={errors}
                name={"email"}
                control={control}
                label={"E-mail"}
                style={{ mt: "15px" }}
              />
            </Box>}

        </ModalBody>

        <Box p="0 30px">
          <Divider border="1px solid #D9D9D9" />
        </Box>
        <ModalFooter gap="21px" p="30px">
          <Btn mode="send" onClick={() =>
            close()
          }>
            Подтвердить
          </Btn>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
