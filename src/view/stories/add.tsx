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
import Label from "components/label/label";
import { ReactSelect } from "components/reactSelect";
import { toastError, toastSuccess } from "components/toast/popUp";
import Upload from "components/upload/upload";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import mediaService from "server/media";
import storeService from "server/store";

type Props = {
  open: any;
  close: () => void;
  refetch: () => void;
  type: "show" | "add";
};

const OverlayOne = () => (
  <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
);

const seletData = [
  { label: "Video", value: "video" },
  { label: "Photo", value: "photo" },
];

export function AddEvents({ open, close, refetch, type }: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [images, setImages] = useState<object[]>([]);
  const [waterMark, setWaterMark] = useState<object[]>([]);
  const [required, setRequired] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      story_type: null,
      description: "",
      media_url: null,
    },
  });

  const watchedValues = watch();
  const story_type = (watchedValues?.story_type as any)?.value === "video";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const { mutate: add, isLoading: addLoad } = useMutation({
    mutationFn: (data: any) => storeService.create(data),
    onSuccess: (res) => {
      toastSuccess("Успешно добавлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: edit, isLoading: editLoad } = useMutation({
    mutationFn: (data: any) => storeService.update(open?.id, data),
    onSuccess: () => {
      toastSuccess("Успешно обновлено!");
      reset();
      close();
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  

  const formSubmit = (data: any) => {
    // Reset required state
    setRequired(false);
    
    // Check if story_type is selected
    if (!data?.story_type) {
      return;
    }
    
    // Check if description is provided
    if (!data?.description || data?.description.trim() === "") {
      return;
    }
    
    // Validate based on story type
    if (data?.story_type?.value === "video") {
      // For video: check if video_cover is uploaded
      if (waterMark.length === 0) {
        return setRequired(true);
      }
      // Check if media_url is selected for video
      if (!data.media_url) {
        return;
      }
    } else {
      // For photo: check if image is uploaded
      if (images.length === 0) {
        return setRequired(true);
      }
    }
    
    const params = {
      is_active: isChecked,
      story_type: data?.story_type?.value,
      description: data?.description,
      video_cover: waterMark[0] ? waterMark[0] : undefined,
      media_url: !story_type ? images[0] : data.media_url?.value,
    };
    
    if (open?.id) edit(params);
    else add(params);
  };

  console.log("open =>>>");

  const { data: mediaData } = useQuery<any>({
    queryKey: ["media_getAll"],
    queryFn: () => mediaService.getAll(),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  useEffect(() => {
    if (open?.id && mediaData) {
      setValue(
        "story_type",
        seletData.find((i) => i.value === open.story_type) || null as any
      );
      setValue(
        "media_url",
        open.story_type === "video"
          ? {
              label: mediaData?.data?.find((i: any) => i.url === open.media_url)?.name,
              value: open.media_url,
            }
          : open.media_url
      );
      setValue("description", open.description);
      setIsChecked(open?.is_active);
      setImages([open.media_url]);
      setWaterMark([open.video_cover]);
    }
  }, [open, mediaData, setValue]);

  return (
    <Modal scrollBehavior="inside" isOpen={open} onClose={close} isCentered size={"4xl"}>
      <OverlayOne />
      <form onSubmit={handleSubmit(formSubmit)}>
        <ModalContent>
          <ModalHeader p="26px 30px 15px 30px">
            <HStack justify="space-between">
              <Text fontSize="30px" fontWeight="700">
                {type === "show" ? "Просмотр" : open?.id ? "Редактировать" : "Добавить"}
              </Text>
            </HStack>
          </ModalHeader>

          <ModalBody p="0px 30px 30px 30px">
            <Box>
              <Box>
                <ReactSelect
                  options={seletData}
                  load={false}
                  error={errors}
                  name={"story_type"}
                  label="Выберите тип *"
                  control={control}
                  disabled={type === "show"}
                />
              </Box>
              <Box mt={"25px"}>
                <Box>
                  <Label>Статус</Label>
                </Box>

                <Box display={"flex"} gap={"10px"}>
                  <Switch
                    isChecked={isChecked}
                    id="check"
                    onChange={handleChange}
                    colorScheme="green"
                    disabled={type === "show"}
                  />
                  <FormLabel
                    htmlFor="check"
                    mb="0"
                    color="#46BB0C"
                    fontSize="14px"
                    fontWeight={700}
                  >
                    {isChecked ? "Активен" : "Не активен"}
                  </FormLabel>
                </Box>
              </Box>

              <Box mt={"25px"}>
                <CustomInput
                  error={errors}
                  name={"description"}
                  control={control}
                  label={"Название *"}
                  required={true}
                  disabled={type === "show"}
                />
              </Box>

              <Box mt="25px">
                {!story_type ? (
                  <Box>
                    <Box>
                      <Label>Добавить файл *</Label>
                    </Box>
                    <Upload
                      image={images}
                      setImage={setImages}
                      error={required}
                      deleteDisabled={type === "show"}
                      addDisable={images.length > 0}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Box mb={"15px"}>
                      <Box>
                        <Label>Oбложка *</Label>
                      </Box>
                      <Upload
                        image={waterMark}
                        setImage={setWaterMark}
                        error={required}
                        deleteDisabled={type === "show"}
                        addDisable={waterMark.length > 0}
                      />
                    </Box>

                    <Box>
                      <Label>Медиа *</Label>
                    </Box>
                    <ReactSelect
                      error={errors}
                      options={mediaData?.data?.map((item: any) => ({
                        label: item.name,
                        value: item.url,
                      }))}
                      control={control}
                      name={"media_url"}
                    />
                  </Box>
                )}

                <Box mt={"15px"}>
                  <Text color={"#5B5B5B"} fontSize={12} fontWeight={600}>
                    Файл будет доступен в приложении в течение 24 часа, после чего деактивируется
                  </Text>
                </Box>
              </Box>
            </Box>
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

            <Btn load={open.id ? editLoad : addLoad} type="submit" mode="send">
              Сохранить
            </Btn>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
