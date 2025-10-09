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
import volunteerService from "server/volunteers";
import { Loading } from "components/loading";
import Phone from "components/phone/phone";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowEvents({ open, close }: Props) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(["faq_byId", open?.id], () => volunteerService.getID(open?.id), {
    onSuccess: (res: any) => {
      setValue("user", (res?.users?.first_name || "") + " " + (res?.users?.last_name || ""));
      setValue("email", res?.users?.email);
      setValue("phone", res?.users?.phone);
    },
    onError: (err: any) => err?.data?.detail?.detail,
    enabled: Boolean(open?.id),
  });

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <ModalContent>
        <ModalHeader p="26px 30px 15px 30px">
          <HStack justify="space-between">
            <Text fontSize="30px" fontWeight="700">
              Просмотр Заявки
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
        <ModalBody p="0px 30px 30px 30px">
          {isLoading ? (
            <Loading />
          ) : (
            <Box>
              <CustomInput
                error={errors}
                name={"user"}
                control={control}
                label={"Пользователь"}
                disabled
                variant="unstyled"
              />
              <Box mt={"15px"} mb={"15px"}>
                <Phone error={errors} name={"phone"} control={control} variant="unstyled" />
              </Box>

              <CustomInput
                error={errors}
                name={"email"}
                control={control}
                label={"E-mail"}
                disabled
                variant="unstyled"
              />
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
            }}
          >
            Подтвердить
          </Btn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
