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
  VStack,
  Button,
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { CustomInput } from "components/input";
import LanguageChange from "components/languages-change";
import { shallowEqual, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { RangeDatePicker } from "components/rangeDatePicker";
import { RangeTimePicker } from "components/rangeTimePicker";
import { ReactSelect } from "components/reactSelect";
import { useState, useRef } from "react";
import Upload from "components/upload/upload";
import { CustomTextArea } from "components/textArea";
import { useQuery } from "react-query";
import eventService from "server/events";
import { Loading } from "components/loading";
import { EventsResponse } from "types/events.types";
import { LangType } from "types/global.types";
import { toastError, toastSuccess } from "components/toast/popUp";
import Phone from "components/phone/phone";
import { QRCodeSVG } from "qrcode.react";
import { saveAs } from "file-saver";
import { AiOutlineDownload } from "react-icons/ai";

type Props = {
  open: any;
  close: () => void;
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

export function ShowEvents({ open, close }: Props) {
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);
  const [date, setDate] = useState<any>(null);
  const [time, setTime] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoading } = useQuery(["events_byId", open?.id], () => eventService.getID(open?.id), {
    onSuccess: (res: EventsResponse) => {
      const [end_hour, end_minute] = res?.end_time.split(":");
      const [start_hour, start_minute] = res.start_time.split(":");
      setTime({
        endHour: end_hour,
        endMinute: end_minute,
        startHour: start_hour,
        startMinute: start_minute,
      });
      languages.forEach((e: LangType) => {
        const fieldName = ("name_" + e.shortcode) as keyof typeof res;
        const fieldDesc = ("description_" + e.shortcode) as keyof typeof res;
        const fieldAddress = ("address_" + e.shortcode) as keyof typeof res;
        setValue(fieldName, res[fieldName]);
        setValue(fieldDesc, res[fieldDesc]);
        setValue(fieldAddress, res[fieldAddress]);
        setDate({
          from: new Date(res?.start_date),
          to: new Date(res?.end_date),
        });
        setValue("city", {
          label: res?.cities?.name_ru,
          id: res.cities.id,
        });
        setValue("address", res.address);
        setValue("place", res.place);
        setValue("phone", res.phone);
        setValue("price", res.price);
        setValue("scores", res.scores);
        setImages(res?.image_urls);
      });
      if (res?.qr_code) {
        setQrCode(res.qr_code);
      }
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    try {
      // SVG'ni PNG'ga aylantirish
      const svgElement = qrCodeRef.current?.querySelector('svg');
      if (!svgElement) {
        toastError("QR код не найден");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `qr-code-event-${open?.id || 'event'}.png`);
              toastSuccess("QR код успешно загружен!");
            }
          });
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toastError("Ошибка при загрузке QR кода");
    }
  };

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <ModalContent>
        <ModalHeader p="26px 30px 15px 30px">
          <HStack justify="space-between">
            <Text fontSize="30px" fontWeight="700">
              Просмотр события
            </Text>
            <LanguageChange />
          </HStack>
        </ModalHeader>
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
                  disabled
                  variant="unstyled"
                  hidden={Boolean(item.shortcode !== defaultLang)}
                />
              ))}

              <HStack mt="15px" gap="20px">
                <RangeDatePicker error={errors} disabled={true} setDate={setDate} date={date} />
                <RangeTimePicker error={errors} disabled={true} setTime={setTime} time={time} />
              </HStack>

              <HStack mt="15px">
                <ReactSelect disabled options={[]} name={"city"} label="Город" control={control} />

                {languages.map((item: any, index: number) => (
                  <CustomInput
                    key={index}
                    error={errors}
                    name={`${"address_" + item.shortcode}`}
                    control={control}
                    langCode={item.shortcode}
                    label={"Адрес"}
                    disabled
                    variant="unstyled"
                    hidden={Boolean(item.shortcode !== defaultLang)}
                  />
                ))}
              </HStack>

              <Box mt={"25px"}>
                <Phone error={errors} name={"phone"} control={control} variant="unstyled" />
              </Box>

              <HStack mt="15px">
                <CustomInput
                  error={errors}
                  name={"place"}
                  control={control}
                  label={"Места"}
                  type="number"
                  disabled
                  variant="unstyled"
                />
                <CustomInput
                  error={errors}
                  name={"price"}
                  control={control}
                  label={"Цена"}
                  type="number"
                  disabled
                  variant="unstyled"
                />
                <CustomInput
                  error={errors}
                  name={"scores"}
                  control={control}
                  label={"Баллы"}
                  type="number"
                  disabled
                  variant="unstyled"
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
                  disabled
                  required={item.shortcode === "ru"}
                  hidden={Boolean(item.shortcode !== defaultLang)}
                  style={{ marginTop: "15px" }}
                />
              ))}

              <Upload addDisable deleteDisabled image={images} setImage={setImages} />

              {qrCode && (
                <Box mt="25px" p="20px" border="1px solid #D9D9D9" borderRadius="8px">
                  <Text fontSize="16px" fontWeight="600" mb="15px">
                    QR код события
                  </Text>
                  <VStack spacing="15px" align="flex-start">
                    <Box
                      ref={qrCodeRef}
                      p="15px"
                      bg="white"
                      borderRadius="8px"
                      border="1px solid #E2E8F0"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <QRCodeSVG
                        value={qrCode}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </Box>
                    <Button
                      onClick={downloadQRCode}
                      colorScheme="green"
                      size="md"
                      variant="outline"
                      leftIcon={<AiOutlineDownload />}
                    >
                      Скачать QR код
                    </Button>
                  </VStack>
                </Box>
              )}
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
