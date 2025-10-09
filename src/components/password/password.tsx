import { Box, IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { Controller } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

type ComponentTypes = {
  name?: any;
  error?: any;
  style?: any;
  control?: any;
  label?: string;
};

export const PasswordField = ({ name, error, style, control, label = "" }: ComponentTypes) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box sx={{ w: "100%", ...style }}>
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: "Поле является обязательным для заполнения",
          validate: {
            minLength: (v) => v.length >= 8,
          },
        }}
        render={({ field }: any) => (
          <InputGroup>
            <Input
              {...field}
              mt="4px"
              h="40px"
              bg="#fff"
              fontSize="14px"
              fontWeight="500"
              padding="0 12px"
              autoComplete="off"
              borderColor="#D9D9D9"
              value={field.value || ""}
              errorBorderColor="#ED665E"
              isInvalid={Boolean(error?.[name])}
              type={showPassword ? "text" : "password"}
            />
            <InputRightElement mt="5px">
              <IconButton
                variant="text"
                color="#C0C0C0"
                onClick={handleClickShowPassword}
                icon={!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                aria-label={!showPassword ? "Mask password" : "Reveal password"}
              />
            </InputRightElement>
          </InputGroup>
        )}
      />

      {error?.[name]?.type === "minLength" && (
        <HelperText>Поле пароля должно быть не менее 8 символов.</HelperText>
      )}
    </Box>
  );
};
