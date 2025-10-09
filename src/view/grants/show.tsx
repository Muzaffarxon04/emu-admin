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
import { useState } from 'react';
import Upload from "components/upload/upload";
import { CustomTextArea } from "components/textArea";
import { useQuery } from "react-query";
import grandService from "server/grand";
import { Loading } from "components/loading";
import { GrandResponse } from "types/grand.types";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowEvents({ open, close }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);
  const [images, setImages] = useState<any>(null);

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(
    ['grand_byId', open?.id],
    () => grandService.getID(open?.id),
    {
      onSuccess: (res: GrandResponse) => {
        languages.forEach((e: any) => {
          const fieldName = 'name_' + e.shortcode as keyof typeof res;
          const fieldDesc = 'description_' + e.shortcode as keyof typeof res;
          setValue(fieldName, res?.[fieldName]);
          setValue(fieldDesc, res?.[fieldDesc]);
          setValue('form_link', res?.form_link);
          setImages(res?.image_url);
        });
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
              Просмотр гранта
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
        <ModalBody p="0px 30px 30px 30px">
          {isLoading ? <Loading /> : <Box>
            {languages.map((item: any, index: number) => (
              <CustomInput
                key={index}
                error={errors}
                name={`${"name_" + item.shortcode}`}
                control={control}
                langCode={item.shortcode}
                label={"Название"}
                disabled
                variant='unstyled'
                hidden={Boolean(item.shortcode !== defaultLang)}
              />
            ))}

            <CustomInput
              error={errors}
              name={"form_link"}
              control={control}
              disabled
              variant='unstyled'
              label={"Ссылка на форму"}
              style={{ mt: "15px" }}
            />


            {languages.map((item: any, index: number) => (
              <CustomTextArea
                key={index}
                error={errors}
                name={`${"description_" + item.shortcode}`}
                control={control}
                langCode={item.shortcode}
                label={"Описание"}
                disabled
                required={item.shortcode === 'ru'}
                hidden={Boolean(item.shortcode !== defaultLang)}
                style={{ marginTop: "15px" }}
              />
            ))}
            {
              images ? <Upload deleteDisabled addDisable image={images} setImage={setImages} /> : ''
            }

          </Box>}

        </ModalBody>

        <Box p="0 30px">
          <Divider border="1px solid #D9D9D9" />
        </Box>
        <ModalFooter gap="21px" p="30px">
          <Btn mode='send' onClick={() => {
            close()
          }}>
            Подтвердить
          </Btn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
