import { Box } from "@chakra-ui/react";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { CustomOption } from "./customOption";
import styles from "./styles.module.scss";

type ComponentTypes = {
  options: object[];
  load?: boolean;
  label?: string | null;
  name?: any;
  control: any;
  error?: any;
  disabled?: boolean;
};

export const ReactSelect = ({
  options,
  load,
  label = "",
  name,
  control,
  error,
  disabled,
}: ComponentTypes) => {
  return (
    <Box sx={{ w: "100%" }} position="relative">
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: "Поле является обязательным для заполнения",
        }}
        render={({ field }: any) => (
          <Select
            options={options || []}
            isLoading={load}
            isClearable
            isSearchable
            menuPosition="fixed"
            placeholder={""}
            isDisabled={disabled}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                border:
                  error?.[name]?.type === "required"
                    ? "2px solid #ED665E"
                    : disabled
                    ? "none"
                    : "1px solid #D9D9D9",
                background: disabled ? "transparent" : "#fff",
                height: disabled ? "20px" : "40px",
                borderRadius: "7px",
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: disabled ? "0px" : "0 12px",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#000",
              }),
            }}
            onChange={(values) => {
              field.onChange(values || null);
            }}
            onBlur={(values) => {
              field.onBlur(values || null);
            }}
            value={field.value || null}
            className={disabled ? styles.disabled : styles.select}
            components={{
              Option: CustomOption,
              IndicatorSeparator: () => null,
            }}
          />
        )}
      />

      {error?.[name]?.type === "required" && <HelperText>{error?.[name]?.message}</HelperText>}
    </Box>
  );
};
