import { Input, useClipboard, InputGroup, InputRightElement, HStack, Box } from "@chakra-ui/react";
import { Btn } from "components/button";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { toastSuccess } from "components/toast/popUp";
import { Controller } from "react-hook-form";
import { MdContentCopy } from "react-icons/md";

type Props = {
  required?: boolean;
  disabled?: boolean;
  name: string;
  control: any;
  error: any;
  setValue: any;
  watch: any;
};

export function PasswordGenerator({
  disabled,
  required = true,
  name,
  control,
  error,
  setValue,
  watch,
}: Props) {
  const generatePassword = () => {
    const length = 8;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters.charAt(randomIndex);
    }

    setValue(name, newPassword);
  };

  const { onCopy } = useClipboard(watch()[name]);

  const handleCopy = () => {
    onCopy();
    toastSuccess("Пароль скопирован.");
  };

  return (
    <Box position="relative">
      <Label>Пароль</Label>
      <HStack>
        <Controller
          name={name}
          control={control}
          rules={{
            required: required && "Поле является обязательным для заполнения",
            pattern: {
              value: /^.{8,}$/,
              message: "Поле должно содержать 8 символов.",
            },
          }}
          render={({ field }: any) => (
            <InputGroup>
              <Input
                {...field}
                autoComplete="off"
                disabled={disabled}
                _disabled={{
                  color: "#000",
                }}
                value={field.value || ""}
                borderColor="#D9D9D9"
                padding={"0 12px"}
                fontSize="14px"
                fontWeight="500"
                h={"40px"}
                mt="4px"
                isInvalid={Boolean(error?.[name])}
                errorBorderColor="#ED665E"
              />
              <InputRightElement onClick={handleCopy} cursor="pointer">
                <MdContentCopy style={{ marginTop: "6px", color: "#C0C0C0" }} size={18} />
              </InputRightElement>
            </InputGroup>
          )}
        />
        <Btn
          type="button"
          disabled={disabled}
          onClick={generatePassword}
          bg="#ECFFD8"
          color="#46BB0C"
          fontWeight="700"
          fontSize="16px"
          w="170px"
          p="8px 16px"
          _hover={{
            bg: "#ECFFD8",
          }}
        >
          Сгенерировать
        </Btn>
      </HStack>

      {error?.[name]?.type === "required" && (
        <HelperText type={1}>{error?.[name]?.message}</HelperText>
      )}

      {error?.[name]?.type === "pattern" && (
        <HelperText type={1}>{error?.[name]?.message}</HelperText>
      )}
    </Box>
  );
}
