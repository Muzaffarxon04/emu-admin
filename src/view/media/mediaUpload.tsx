import { Box, HStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { Loading } from "components/loading";
import { toastSuccess } from "components/toast/popUp";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";

export default function MediaUpload({ error, refetch }: { error: any; refetch: () => void }) {
  const [errors, setErrors] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const type = process.env.REACT_APP_BASE_URL;
  const access_token = localStorage.getItem("emu_token");

  const uploadVideo = async (file: File) => {
    if (!file) {
      setErrors("Файл не найден!");
      return;
    }

    try {
      setIsLoading(true);
      setErrors(false); // Oldingi xatolarni tozalash

      const formData = new FormData();
      formData.append("file", file);
      formData.append("video_name", file.name || "upload media");

      const response = await axios.post(`${type}/upload/video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });

      toastSuccess("Успешно загружено!");
      refetch();
    } catch (error: any) {
      setErrors(error?.response?.data?.message || "Произошла ошибка!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadVideo(file);
    } else {
      setErrors("Iltimos, video fayl yuklang!");
    }
  };

  return (
    <Box className={styles.root}>
      <label htmlFor="file" className={styles.fileInput}>
        <Box
          className={styles.uploadButton}
          border={error ? "1px dashed #ED665E" : "1px dashed #46BB0C"}
        >
          <input accept="video/*" hidden id="file" type="file" onChange={handleChange} />
          {isLoading && !errors ? (
            <Loading size="md" />
          ) : (
            <HStack flexDirection="column" justifyContent={"center"}>
              <Box>
                <FiUpload fontSize={35} color="#000" />
              </Box>
              <Text color="#000">
                Чтобы загрузить медиафайл с помощью этого файла, вам необходимо нажать кнопку выше.
              </Text>
            </HStack>
          )}
        </Box>
      </label>
    </Box>
  );
}
