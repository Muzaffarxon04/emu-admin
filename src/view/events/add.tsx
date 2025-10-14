import {
  Box,
  Divider,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
} from "@chakra-ui/react";
import { Btn } from "components/button";
import { CustomInput } from "components/input";
import LanguageChange from "components/languages-change";
import { Loading } from "components/loading";
import Phone from "components/phone/phone";
import { RangeDatePicker } from "components/rangeDatePicker";
import { RangeTimePicker } from "components/rangeTimePicker";
import { ReactSelect } from "components/reactSelect";
import { CustomTextArea } from "components/textArea";
import { toastError, toastSuccess } from "components/toast/popUp";
import Upload from "components/upload/upload";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { shallowEqual, useSelector } from "react-redux";
import cityService from "server/cities";
import eventService from "server/events";
import { EventsResponse } from "types/events.types";
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
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [cityList, setCityList] = useState<object[]>([]);
  const [date, setDate] = useState<any>(null);
  const [time, setTime] = useState<any>();
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
      });
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
      setValue("price", res.price);
      setValue("phone", res.phone);
      setValue("scores", res.scores);
      setIsChecked(res.price ? true : false);
      setImages(res?.image_urls);
      setValue("phone", res.phone);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: Boolean(open?.id),
  });

  const { isLoading: cityLoad } = useQuery(["city_getAll"], () => cityService.getAll(), {
    onSuccess: (res) => {
      setCityList(
        res?.data?.map((data: any) => ({
          label: data?.name_ru,
          id: data?.id,
        }))
      );
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: EventsResponse) => eventService.create(data),
    onSuccess: () => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: EventsResponse) => eventService.update(open?.id, data),
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
      city_id: data.city.id,
      start_date: dayjs(date?.from).format("YYYY-MM-DD"),
      start_time: time.startHour + ":" + time.startMinute + ":00",
      end_date: dayjs(date?.to).format("YYYY-MM-DD"),
      end_time: time.endHour + ":" + time.endMinute + ":00",
      is_paid_event: isChecked,
      price: isChecked ? data.price : 0,
      city: undefined,
      image_urls: images,
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
                {open.id ? "Редактировать событие" : "Добавить событие"}
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
                    required={item.shortcode === "ru"}
                    hidden={Boolean(item.shortcode !== defaultLang)}
                  />
                ))}

                <HStack mt="20px">
                  <RangeDatePicker error={errors} setDate={setDate} date={date} />
                  <RangeTimePicker error={errors} setTime={setTime} time={time} />
                </HStack>

                <HStack mt="20px">
                  <ReactSelect
                    options={cityList}
                    load={cityLoad}
                    error={errors}
                    name={"city"}
                    label="Город"
                    control={control}
                  />

                  {languages.map((item: any, index: number) => (
                    <CustomInput
                      key={index}
                      error={errors}
                      name={`${"address_" + item.shortcode}`}
                      control={control}
                      langCode={item.shortcode}
                      label={"Адрес"}
                      required={item.shortcode === "ru"}
                      hidden={Boolean(item.shortcode !== defaultLang)}
                    />
                  ))}
                </HStack>

                <Box mt={"25px"}>
                  <Phone error={errors} name={"phone"} control={control} />
                </Box>

                <HStack mt={"25px"}>
                  <Switch
                    isChecked={isChecked}
                    id="check"
                    onChange={handleChange}
                    colorScheme="green"
                  />
                  <FormLabel
                    htmlFor="check"
                    mb="0"
                    color="#46BB0C"
                    fontSize="14px"
                    fontWeight={700}
                  >
                    Платное событие
                  </FormLabel>
                </HStack>

                <HStack mt="15px">
                  <CustomInput
                    error={errors}
                    name={"place"}
                    control={control}
                    label={"Места"}
                    type="number"
                  />
                  <CustomInput
                    error={errors}
                    name={"price"}
                    control={control}
                    label={"Цена"}
                    type="number"
                    required={isChecked}
                    active={!isChecked}
                  />
                  <CustomInput
                    error={errors}
                    name={"scores"}
                    control={control}
                    label={"Баллы"}
                    type="number"
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
                    style={{ marginTop: "20px" }}
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
