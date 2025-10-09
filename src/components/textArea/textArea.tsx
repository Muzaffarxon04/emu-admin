import { Box, Textarea } from "@chakra-ui/react";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { Controller } from "react-hook-form";

type ComponentTypes = {
  label?: string | null;
  name?: any;
  control?: any;
  error?: any;
  variant?: "outline" | "unstyled";
  placeholder?: string;
  hidden?: boolean;
  langCode?: string | null;
  required?: any;
  disabled?: boolean;
  style?: any;
};

export const CustomTextArea = ({
  label = "",
  name,
  control,
  error,
  variant = "outline",
  hidden,
  langCode,
  required = true,
  disabled,
  style,
}: ComponentTypes) => {
  return (
    <Box sx={{ w: "100%", ...style }} hidden={hidden} position='relative'>
      <Label>
        {label}
        {langCode && <span style={{ marginLeft: "5px" }}>({langCode})</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required === true && "Поле является обязательным для заполнения",
        }}
        render={({ field }: any) => (
          <Textarea
            {...field}
            _disabled={{
              border: "none",
              color: "#000"
            }}   
            resize={disabled ? "none" : "vertical"}
            autoComplete="off"
            disabled={disabled}
            value={field.value || ""}
            borderColor="#D9D9D9"
            padding={disabled ? '0px' : '12px 12px'}
            fontSize="14px"
            fontWeight="500"
            mt="4px"
            isInvalid={Boolean(error?.[name])}
            errorBorderColor="#ED665E"
            variant={variant}
          />

        )}
      />

      {error?.[name]?.type === "required" && <HelperText>{error?.[name]?.message}</HelperText>}

      {error?.[name]?.type === "pattern" && <HelperText>{error?.[name]?.message}</HelperText>}
    </Box>
  );
};
