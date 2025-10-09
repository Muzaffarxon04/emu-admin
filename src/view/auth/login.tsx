import { Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import { CustomInput } from "components/input";
import { PasswordField } from "components/password";
import { toastError } from "components/toast/popUp";
import { useForm } from "react-hook-form";
import { FaRegUserCircle } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "redux/slices/auth";
import authService from "server/auth";
import { LoginResponse } from "types/user.types";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginResponse>({
    defaultValues: {
      email: "admin@gmail.com",
      password: "12345678",
    },
  });

  const { mutate, isLoading, status } = useMutation({
    mutationFn: (data: LoginResponse) => authService.login(data),
    onSuccess: (res: any) => {
      localStorage.setItem("emu_token", res?.access_token);
      dispatch(setUserData(res?.data));
      navigate("/");
    },
    onError: (err: any) => toastError(err.data.detail.detail),
  });

  const formSubmit = (data: LoginResponse) => mutate(data);

  return (
    <Center maxW="100%" height="100vh" bg="#F7F8FB">
      <Stack spacing="8">
        <Text textAlign="center" fontWeight={700} fontSize={24} mb="20px">
          Добро пожаловать
        </Text>

        <form onSubmit={handleSubmit(formSubmit)}>
          <Box width={{ base: "100%", sm: "450px" }}>
            <CustomInput
              error={errors}
              name={"email"}
              control={control}
              type={"email"}
              label={"Логин"}
              icon={<FaRegUserCircle color="#C0C0C0" />}
              style={{ mb: "15px" }}
            />

            <PasswordField error={errors} name={"password"} control={control} label={"Пароль"} />
          </Box>

          <Button
            w="100%"
            mt="40px"
            type="submit"
            isLoading={status === "error" ? undefined : isLoading}
            bg={"#46BB0C"}
            color={"white"}
            _hover={{
              bg: "#46BB0C",
            }}
          >
            Войти
          </Button>
        </form>
      </Stack>
    </Center>
  );
}
