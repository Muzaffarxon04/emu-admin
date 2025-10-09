import { Box, IconButton, Image, Text } from "@chakra-ui/react";
import { Loading } from "components/loading";
import { toastError } from "components/toast/popUp";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useMutation } from "react-query";
import uploadService from "server/upload";
import styles from "./styles.module.scss";
import UploadButton from "./uploadBtn";

type Props = {
  image: object[];
  setImage: (e: object[]) => void;
  addDisable?: boolean;
  deleteDisabled?: boolean;
  showDisabled?: boolean;
  error?: any;
};

export default function Upload({ image, setImage, addDisable, deleteDisabled, error }: Props) {
  const [errors, setErrors] = useState(false);

  const { mutate: upload, isLoading } = useMutation({
    mutationFn: (data: any) => uploadService.fileUpload(data),
    onSuccess: (res) => {
      setImage([...image, res?.data?.file_url]);
      setErrors(false);
    },
    onError: (err: any) => {
      setErrors(true);
      toastError(err.message);
    },
  });

  const handleChange = (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    upload(formData);
  };

  const handleDelete = (e: any) => setImage(image.filter((i) => i !== e));

  return (
    <Box className={styles.root}>
      <Box className={styles.uploadContainer}>
        {!addDisable ? (
          <label htmlFor="file" className={styles.fileInput}>
            <Box
              className={styles.uploadButton}
              border={error ? "1px dashed #ED665E" : "1px dashed #46BB0C"}
            >
              <input accept="image/*" hidden id="file" type="file" onChange={handleChange} />
              {isLoading && !errors ? <Loading size="md" /> : <UploadButton />}
            </Box>
          </label>
        ) : null}

        <PhotoProvider>
          {image?.map((file: any, index: number) => (
            <Box key={index} className={styles.imageContainer}>
              <PhotoView key={index} src={file}>
                <Image
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                  src={file}
                  className={styles.images}
                  alt="images"
                />
              </PhotoView>
              {deleteDisabled ? null : (
                <Box className={styles.imagesShow}>
                  <IconButton
                    aria-label="right"
                    onClick={() => handleDelete(file)}
                    variant="text"
                    icon={<AiFillDelete className={styles.deleteIcon} />}
                    className={styles.btnDelete}
                  />
                </Box>
              )}
            </Box>
          ))}
        </PhotoProvider>

        {error && (
          <Text
            fontSize="12px"
            fontWeight="400"
            color="#ED665E"
            position="absolute"
            left={0}
            bottom={"-18px"}
          >
            Поле является обязательным для заполнения
          </Text>
        )}
      </Box>
    </Box>
  );
}
