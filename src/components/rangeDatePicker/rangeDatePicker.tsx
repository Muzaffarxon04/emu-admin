import {
  Box,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { HelperText } from "components/helperText";
import Label from "components/label/label";
import { format, getYear, parseISO } from "date-fns";
import en from "date-fns/locale/en-US";
import ru from "date-fns/locale/ru";
import uz from "date-fns/locale/uz";
import { DayPicker } from "react-day-picker";
import { AiOutlineCalendar } from "react-icons/ai";
import { shallowEqual, useSelector } from "react-redux";

const data = new Date();
const year = getYear(data);
const month = data.getMonth();
const day = data.getDate();

type Props = {
  date: any;
  error?: any;
  setDate: any;
  disabled?: boolean;
  newDateDisable?: boolean;
};

export function RangeDatePicker({ date, setDate, disabled, error, newDateDisable = false }: Props) {
  const { defaultLang } = useSelector((state: any) => state.lang, shallowEqual);
  const checkEmpty = Object.keys(error)?.length !== 0 && !date;

  function parseDateString(date: any) {
    if (date) {
      const { from, to } = date;
      return {
        from: typeof from === "string" ? parseISO(from) : from,
        to: typeof to === "string" ? parseISO(to) : to,
      };
    } else {
      return;
    }
  }

  const value = parseDateString(date);

  return (
    <Box w="100%" userSelect="none" zIndex="9999" position="relative">
      <Label>Дата</Label>
      <Popover>
        <PopoverTrigger>
          <Button
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={disabled ? "0px" : "0px 12px"}
            fontSize="14px"
            fontWeight="500"
            disabled={disabled}
            h={disabled ? "20px" : "40px"}
            mt="4px"
            w="100%"
            border={checkEmpty ? "2px solid #ED665E" : disabled ? "none" : "1px solid #D9D9D9"}
            bg="transparent"
            _hover={{
              bg: "transparent",
            }}
            borderRadius="4px"
            cursor="pointer"
          >
            {date
              ? `${value?.from && format(value?.from, "dd-MM-yyyy")} / 
              ${value?.to && format(value?.to, "dd-MM-yyyy")}`
              : "__-__- ____ / __-__- ____"}

            <AiOutlineCalendar size="24px" color="#D9D9D9" />
          </Button>
        </PopoverTrigger>
        {disabled ? null : (
          <PopoverContent w="400px" zIndex="9999" overflow="hidden">
            <PopoverBody p={0}>
              <DayPicker
                fromDate={!newDateDisable ? new Date(year, month, day) : new Date(1970)}
                className="datepicker"
                mode="range"
                selected={date}
                onSelect={setDate}
                disabled={{ before: new Date() }}
                locale={defaultLang === "uz" ? uz : defaultLang === "ru" ? ru : en}
              />
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>

      {checkEmpty && <HelperText>Поле является обязательным для заполнения</HelperText>}
    </Box>
  );
}
