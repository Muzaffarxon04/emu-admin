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
import { shallowEqual, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import orderService from "server/order";
import { Loading } from "components/loading";
import { OrderResponse } from "types/order.types";
import { LangType } from "types/global.types";
import Phone from "components/phone/phone";
import { statusList } from "./status";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowBuy({ open, close }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(["order_byId", open?.id], () => orderService.getID(open?.id), {
    onSuccess: (res: any) => {
      languages.forEach((e: LangType) => {
        const fieldName = "name_" + e.shortcode;
        setValue(fieldName, res?.products[fieldName]);
        setValue("price", res?.products?.price * res?.count);
        setValue("quantyty", res?.count);
        setValue("order_status", statusList.find((i: any) => i.value === res?.order_status)?.title);
        setValue("user", (res?.users?.first_name || "") + " " + (res?.users?.last_name || ""));
        setValue("phone", res?.users?.phone);
      });
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
              Просмотр Заявки/Покупатели
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
                {languages.map((item: any, index: number) => (
                  <CustomInput
                    key={index}
                    error={errors}
                    name={`${"name_" + item.shortcode}`}
                    control={control}
                    langCode={item.shortcode}
                    label={"Название товара"}
                    disabled
                    variant="unstyled"
                    hidden={Boolean(item.shortcode !== defaultLang)}
                  />
                ))}
                <CustomInput
                  error={errors}
                  name={"user"}
                  control={control}
                  label={"Пользаватель"}
                  disabled
                  variant="unstyled"
                />
              </HStack>

              <HStack mt={"15px"}>
                <CustomInput
                  error={errors}
                  name={"price"}
                  control={control}
                  label={"Цена"}
                  disabled
                  variant="unstyled"
                />
                <CustomInput
                  error={errors}
                  name={"quantyty"}
                  control={control}
                  label={"Количество"}
                  disabled
                  variant="unstyled"
                />
              </HStack>
              <HStack mt="15px">
                <Box width="100%">
                  <Phone error={errors} name={"phone"} control={control} variant="unstyled" />
                </Box>
                <CustomInput
                  error={errors}
                  name={"order_status"}
                  control={control}
                  label={"Статус"}
                  disabled
                  variant="unstyled"
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
