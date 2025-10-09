import { Box, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { Controller } from "react-hook-form";

type ComponentTypes = {
  label?: string | null;
  name?: any;
  control?: any;
  error?: any;
  type?: "email" | "password" | "text" | "number";
  variant?: "outline" | "unstyled";
  placeholder?: string;
  hidden?: boolean;
  langCode?: string | null;
  required?: any;
  disabled?: boolean;
  active?: boolean;
  style?: any;
  icon?: React.ReactNode;
  addon?: boolean;
};

export const CustomInput = ({
  label = "",
  name,
  control,
  error,
  type = "text",
  variant = "outline",
  hidden,
  langCode,
  required = true,
  disabled,
  active,
  style,
  icon,
  addon,
}: ComponentTypes) => {
  return (
    <Box sx={{ w: "100%", ...style }} hidden={hidden} position="relative">
      <Label>
        {label}
        {langCode && <span style={{ marginLeft: "5px" }}>({langCode})</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required && "Поле является обязательным для заполнения",
          pattern:
            type === "number"
              ? {
                  value: /^(?!0|-)\d*$/, // 0 ga yoki manfiy sonlarga teng bo'lmagan sonlar uchun
                  message: "Поле должно содержать целое число.",
                }
              : {
                  value: /^(?!\s)(.*\S)?$/, // Boshida va oxirida probel bo'lmasin
                  message: "Поле не должно начинаться или заканчиваться пробелом.",
                },
        }}
        render={({ field }: any) => (
          <InputGroup>
            {addon && <InputLeftAddon mt="4px" children="+998" />}
            <Input
              {...field}
              autoComplete="off"
              disabled={disabled || active}
              type={type}
              _disabled={{
                color: "#000",
              }}
              value={field.value || ""}
              borderColor="#D9D9D9"
              bg={active ? "#F9FAFB" : "#fff"}
              padding={disabled ? "0px" : "0 12px"}
              fontSize="14px"
              fontWeight="500"
              h={disabled ? "20px" : "40px"}
              mt="4px"
              isInvalid={Boolean(error?.[name])}
              errorBorderColor="#ED665E"
              variant={variant}
            />
            <InputRightElement mt="5px">{icon}</InputRightElement>
          </InputGroup>
        )}
      />

      {error?.[name]?.type === "required" && (
        <HelperText type={1}>{error?.[name]?.message}</HelperText>
      )}

      {error?.[name]?.type === "pattern" && (
        <HelperText type={1}>{error?.[name]?.message}</HelperText>
      )}
    </Box>
  );
};
