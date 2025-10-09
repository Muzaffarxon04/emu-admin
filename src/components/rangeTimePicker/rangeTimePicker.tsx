import { useRef } from "react";
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import Label from "components/label/label";
import { AiOutlineCalendar } from "react-icons/ai";
import { HelperText } from "components/helperText";

type Props = {
  setTime: any;
  error?: any;
  time: any;
  disabled?: boolean;
};

export function RangeTimePicker({ setTime, time, disabled, error }: Props) {
  const initRef = useRef<any>();
  const checkEmpty = Object.keys(error)?.length !== 0 && !time;

  const startTime =
    (time?.startHour ? time?.startHour : "0") + "-" + (time?.startMinute ? time?.startMinute : "0");
  const endTime =
    (time?.endHour ? time?.endHour : "0") + "-" + (time?.endMinute ? time?.endMinute : "0");

  const disabledTime = time;

  const hourData = Array.from({ length: 23 }, (_, index) => index + 1);
  const minute = Array.from({ length: 59 }, (_, index) => index + 1);
  const padded = ["00", ...hourData.map((n) => n.toString().padStart(2, "0"))];
  const padded2 = ["00", ...minute.map((n) => n.toString().padStart(2, "0"))];

  const disabledHour = Array.from({ length: time?.startHour }, (_, index) => index + 1);
  const padded3 = ["00", ...disabledHour?.map((n) => n.toString().padStart(2, "0"))];

  console.log("padded3", time);
  return (
    <Box w="100%" userSelect="none" position="relative">
      <Label>Время</Label>
      <Popover closeOnBlur={false} placement="bottom-start" initialFocusRef={initRef}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Button
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding={disabled ? "0px" : "0px 12px"}
                fontSize="14px"
                fontWeight="500"
                h={disabled ? "20px" : "40px"}
                mt="4px"
                w="100%"
                disabled={disabled}
                border={checkEmpty ? "2px solid #ED665E" : disabled ? "none" : " 1px solid #D9D9D9"}
                bg="transparent"
                _hover={{
                  bg: "transparent",
                }}
                borderRadius="4px"
                cursor="pointer"
              >
                {disabledTime
                  ? `${startTime} / 
              ${endTime}`
                  : "__-__/ __-__"}
                <AiOutlineCalendar size="24px" color="#D9D9D9" />
              </Button>
            </PopoverTrigger>
            <PopoverContent display={disabled ? "none" : "block"}>
              <PopoverBody>
                <HStack justify="space-between">
                  <HStack gap={0}>
                    <Box height="200px" overflowX="hidden" overflowY="scroll">
                      {padded.map((h) => (
                        <Box
                          key={h}
                          textAlign="center"
                          borderRadius="4px"
                          cursor="pointer"
                          w="40px"
                          h="28px"
                          fontSize="14px"
                          bg={time?.startHour === h ? "#E6F4FF" : "transparent"}
                          _hover={{
                            bg: "#f5f5f5",
                          }}
                          onClick={(e: any) => setTime({ startHour: e.target.innerText })}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {h}
                        </Box>
                      ))}
                    </Box>
                    <Box height="200px" overflowX="hidden" overflowY="scroll">
                      {padded2.map((m) => (
                        <Box
                          key={m}
                          textAlign="center"
                          borderRadius="4px"
                          cursor="pointer"
                          w="40px"
                          h="28px"
                          fontSize="14px"
                          bg={
                            !time?.startHour
                              ? "#f5f5f5"
                              : time?.startMinute === m
                              ? "#E6F4FF"
                              : "transparent"
                          }
                          _hover={{
                            bg: "#f5f5f5",
                          }}
                          onClick={(e: any) =>
                            !time?.startHour
                              ? null
                              : setTime({
                                  startHour: time.startHour,
                                  startMinute: e.target.innerText,
                                })
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {m}
                        </Box>
                      ))}
                    </Box>
                  </HStack>
                  <Text>/</Text>
                  <HStack gap={0}>
                    <Box height="200px" overflowX="hidden" overflowY="scroll">
                      {padded.map((h: string) => (
                        <Button
                          key={h}
                          textAlign="center"
                          borderRadius="4px"
                          cursor="pointer"
                          w="40px"
                          h="28px"
                          fontSize="14px"
                          bg={
                            !time?.startHour && !time?.startMinute
                              ? "#f5f5f5"
                              : padded3?.includes(h)
                              ? "#f5f5f5"
                              : time?.endHour === h
                              ? "#E6F4FF"
                              : "transparent"
                          }
                          _hover={{
                            bg: "#f5f5f5",
                          }}
                          onClick={(e: any) =>
                            !time?.startHour && !time?.startMinute
                              ? null
                              : padded3?.includes(h)
                              ? null
                              : setTime({ ...time, endHour: e.target.innerText })
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {h}
                        </Button>
                      ))}
                    </Box>
                    <Box height="200px" overflowX="hidden" overflowY="scroll">
                      {padded2.map((m) => (
                        <Button
                          key={m}
                          textAlign="center"
                          borderRadius="4px"
                          cursor="pointer"
                          w="40px"
                          h="28px"
                          fontSize="14px"
                          bg={
                            !time?.endHour
                              ? "#f5f5f5"
                              : time?.endMinute === m
                              ? "#E6F4FF"
                              : "transparent"
                          }
                          _hover={{
                            bg: "#f5f5f5",
                          }}
                          onClick={(e: any) =>
                            !time?.endHour
                              ? null
                              : setTime({ ...time, endMinute: e.target.innerText })
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {m}
                        </Button>
                      ))}
                    </Box>
                  </HStack>
                </HStack>
                <Box mt="15px" w="100%" display="flex" justifyContent="flex-end">
                  <Button
                    cursor={!disabledTime ? "not-allowed" : "pointer"}
                    colorScheme={!disabledTime ? "gray" : "twitter"}
                    w="15%"
                    h="26px"
                    fontSize="14px"
                    onClick={() => (!disabledTime ? null : onClose())}
                    ref={initRef}
                  >
                    ок
                  </Button>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>

      {checkEmpty && <HelperText>Поле является обязательным для заполнения</HelperText>}
    </Box>
  );
}
