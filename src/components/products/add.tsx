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
import { useState } from "react";
import Upload from "components/upload/upload";
import { CustomTextArea } from "components/textArea";
import { ReactSelect } from "components/reactSelect";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useMutation, useQuery } from "react-query";
import productService from "server/product";
import { ProductResponse } from "types/product.types";
import { Loading } from "components/loading";
import categoryService from "server/category";
import { CategoryResponse } from "types/category.types";

type Props = {
  open: any;
  close: () => void;
  refetch: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function AddProduct({ open, close, refetch }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);
  const [images, setImages] = useState<object[]>([]);
  const [required, setRequired] = useState(false);
  const [category, setCategory] = useState<object[]>([]);

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

  const { isLoading } = useQuery(["product_byId", open?.id], () => productService.getID(open?.id), {
    onSuccess: (res: any) => {
      languages.forEach((e: any) => {
        const fieldName = "name_" + e.shortcode;
        const fieldDesc = "description_" + e.shortcode;
        setValue(fieldName, res?.[fieldName]);
        setValue(fieldDesc, res?.[fieldDesc]);
        setValue("price", res?.price);
        setValue("quantity", res?.quantity);
        setValue("category", {
          label: res?.categories?.name_ru,
          id: res?.categories?.id,
        });
        setImages(res.images);
      });
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  const { isLoading: categoryLoad } = useQuery(
    ["category_getAll", open?.id],
    () => categoryService.getAll(),
    {
      onSuccess: (res: any) => {
        setCategory(
          res?.data?.map((i: CategoryResponse) => ({
            label: i.name_ru,
            id: i.id,
          }))
        );
      },
      onError: (err: any) => toastError(err?.data?.detail?.detail),
      enabled: Boolean(open),
    }
  );

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: ProductResponse) => productService.create(data),
    onSuccess: () => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: ProductResponse) => productService.update(open?.id, data),
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
      category_id: data.category.id,
      category: undefined,
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
                {open?.id ? "Редактировать товар" : "Добавить товар"}
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
                      label={"Название"}
                      required={item.shortcode === "ru"}
                      hidden={Boolean(item.shortcode !== defaultLang)}
                    />
                  ))}
                  <ReactSelect
                    error={errors}
                    load={categoryLoad}
                    options={category}
                    name={"category"}
                    label="Категория"
                    control={control}
                  />
                </HStack>

                <HStack mt={"15px"}>
                  <CustomInput
                    error={errors}
                    name={"price"}
                    type="number"
                    control={control}
                    label={"Цена"}
                  />{" "}
                  <CustomInput
                    error={errors}
                    name={"quantity"}
                    type="number"
                    control={control}
                    label={"Количество"}
                  />
                </HStack>

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
            <Btn load={open.id ? editLoad : addLoad} type="submit" mode="send" onClick={checkError}>
              Сохранить
            </Btn>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
