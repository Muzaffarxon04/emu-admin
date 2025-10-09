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
import { Loading } from "components/loading";
import { CustomTextArea } from "components/textArea";
import { toastError, toastSuccess } from "components/toast/popUp";
import Upload from "components/upload/upload";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { shallowEqual, useSelector } from "react-redux";
import newsService from "server/news";
import { LangType } from "types/global.types";
import { NewsResponse } from "types/news.types";

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
  const [images, setImages] = useState<object[]>([]);
  const [required, setRequired] = useState(false);

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

  const { isLoading } = useQuery(["events_byId", open?.id], () => newsService.getID(open?.id), {
    onSuccess: (res: NewsResponse) => {
      languages.forEach((e: LangType) => {
        const fieldName = ("name_" + e.shortcode) as keyof typeof res;
        const fieldDesc = ("description_" + e.shortcode) as keyof typeof res;
        setValue(fieldName, res?.[fieldName]);
        setValue(fieldDesc, res?.[fieldDesc]);
      });
      setImages(res?.images);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: NewsResponse) => newsService.create(data),
    onSuccess: () => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: NewsResponse) => newsService.update(open?.id, data),
    onSuccess: () => {
      toastSuccess("Успешно обновлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const formSubmit = (data: any) => {
    if (images.length === 0) {
      return setRequired(true);
    }
    const params = {
      ...data,
      images: images,
    };
    if (open?.id) edit(params);
    else add(params);
  };

  return (
    <Modal scrollBehavior="outside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <ModalContent>
        <ModalHeader p="26px 30px 15px 30px">
          <HStack justify="space-between">
            <Text fontSize="30px" fontWeight="700">
              {open.id ? "Редактировать новость" : "Добавить новость"}
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
        <form onSubmit={handleSubmit(formSubmit)}>
          <ModalBody p="0px 30px 30px 30px">
            {isLoading ? (
              <Loading />
            ) : (
              <Box>
                {languages.map((item: any, index: number) => (
                  <CustomInput
                    key={index}
                    error={errors}
                    name={`${"name_" + item.shortcode}`}
                    control={control}
                    langCode={item.shortcode}
                    label={"Название"}
                    required={item.shortcode === "ru"}
                    hidden={Boolean(item.shortcode !== defaultLang)}
                  />
                ))}

                {languages.map((item: any, index: number) => (
                  <CustomTextArea
                    key={index}
                    error={errors}
                    name={`${"description_" + item.shortcode}`}
                    control={control}
                    langCode={item.shortcode}
                    label={"Описание"}
                    required={item.shortcode === "ru"}
                    hidden={Boolean(item.shortcode !== defaultLang)}
                    style={{ marginTop: "15px" }}
                  />
                ))}

                <Box mt="25px">
                  <Upload image={images} setImage={setImages} error={required} />
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
        </form>
      </ModalContent>
    </Modal>
  );
}
