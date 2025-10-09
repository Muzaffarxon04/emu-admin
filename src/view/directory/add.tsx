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
import { toastError, toastSuccess } from "components/toast/popUp";
import { useMutation, useQuery } from "react-query";
import cityService from "server/cities";
import { CityResponse } from "types/city.types";
import { Loading } from "components/loading";
import { LangType } from "types/global.types";

type Props = {
  open: any;
  close: () => void;
  refetch: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function AddEvents({ open, close, refetch }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const checkError = () => {
    const error = Object.keys(errors).length;
    if (error !== 0) return toastError("Произошла ошибка при вводе информации. Проверьте поля.");
  };

  const { isLoading } = useQuery(["events_byId", open?.id], () => cityService.getID(open?.id), {
    onSuccess: (res: CityResponse) => {
      languages.forEach((e: LangType) => {
        const fieldName = ("name_" + e.shortcode) as keyof typeof res;
        setValue(fieldName, res?.[fieldName]);
      });
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: CityResponse) => cityService.create(data),
    onSuccess: () => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    }, 
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  console.log("addLoad", addLoad);

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: CityResponse) => cityService.update(open?.id, data),
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
                {open?.id ? "Редактировать город" : "Добавить город"}
              </Text>
              <LanguageChange />
            </HStack>
          </ModalHeader>
          <ModalBody p="0px 30px 30px 30px">
            {isLoading ? (
              <Loading />
            ) : (
              languages.map((item: any, index: number) => (
                <CustomInput
                  key={index}
                  error={errors}
                  name={`${"name_" + item.shortcode}`}
                  control={control}
                  langCode={item.shortcode}
                  label={"Город"}
                  required={item.shortcode === "ru"}
                  hidden={Boolean(item.shortcode !== defaultLang)}
                />
              ))
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
            <Btn load={open.id ? editLoad : addLoad} type="submit" mode="send" onClick={checkError}>
              Сохранить
            </Btn>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
