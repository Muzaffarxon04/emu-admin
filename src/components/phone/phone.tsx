import { PhoneInput } from "react-international-phone";
import { HelperText } from "components/helperText";
import { Box } from "@chakra-ui/react";
import Label from "components/label/label";
import { Controller } from "react-hook-form";

export default function Phone({ error, variant, name, control }: any) {
  return (
    <Box position="relative">
      <Label>Номер телефона:</Label>

      <Box pt="4px"></Box>

      <Controller
        name={name}
        control={control}
        rules={{
          pattern: {
            value: /^.{13}$/,
            message: "Длина поля должна быть 13 символов",
          },
        }}
        render={({ field }: any) => (
          <PhoneInput
            defaultCountry="uz"
            value={field.value || ""}
            hideDropdown={true} // country select disablded
            forceDialCode={true} // davlat raqmlarini o'chirishni blocklash
            disabled={variant === "unstyled"}
            onChange={(values) => {
              field.onChange(values || null);
            }}
            countrySelectorStyleProps={{
              buttonStyle: {
                height: "40px",
                border:
                  variant === "unstyled"
                    ? "none"
                    : error?.[name]?.type === "pattern"
                    ? "2px solid #ED665E"
                    : "1px solid #CECECE",
                background: "transparent",
              },
            }}
            inputStyle={{
              width: "100%",
              height: "40px",
              fontFamily: "Lato !important",
              fontSize: "14px",
              fontWeight: 500,
              border:
                variant === "unstyled"
                  ? "none"
                  : error?.[name]?.type === "pattern"
                  ? "2px solid #ED665E"
                  : "1px solid #CECECE",
              background: "transparent",
            }}
          />
        )}
      />
      {error?.[name]?.type === "pattern" && <HelperText>{error?.[name]?.message}</HelperText>}
    </Box>
  );
}
