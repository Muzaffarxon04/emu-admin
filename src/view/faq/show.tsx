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
import { CustomTextArea } from "components/textArea";
import { useQuery } from "react-query";
import faqService from "server/faq";
import { Loading } from "components/loading";
import { FaqResponse } from "types/faq.types";
import { LangType } from "types/global.types";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowEvents({ open, close }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(
    ['faq_byId', open?.id],
    () => faqService.getID(open?.id),
    {
      onSuccess: (res: FaqResponse) => {
        languages.forEach((e: LangType) => {
          const fieldName = 'name_' + e.shortcode as keyof typeof res;
          const fieldDesc = 'description_' + e.shortcode as keyof typeof res;
          setValue(fieldName, res?.[fieldName]);
          setValue(fieldDesc, res?.[fieldDesc]);
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
              Просмотр вопроса
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
        <ModalBody p="0px 30px 30px 30px">
          {
            isLoading ? <Loading /> : <Box>
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

              {languages.map((item: any, index: number) => (
                <CustomTextArea
                  key={index}
                  error={errors}
                  name={`${"description_" + item.shortcode}`}
                  control={control}
                  disabled
                  langCode={item.shortcode}
                  label={"Описание"}
                  required={item.shortcode === 'ru'}
                  hidden={Boolean(item.shortcode !== defaultLang)}
                  style={{ marginTop: "15px" }}
                />
              ))}

            </Box>
          }

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
