
import {  createStandaloneToast } from '@chakra-ui/react';
const { toast } = createStandaloneToast()

export function toastSuccess(message: string) {
  toast({
    title: message,
    status: 'success',
    duration: 9000,
    isClosable: true,
    position: "top-right",
  })
}

export function toastWarning(message: string) {
  toast({
    title: message,
    status: 'warning',
    duration: 9000,
    isClosable: true,
    position: "top-right"
  })
}

export function toastError(message: string) {
  toast({
    title: message,
    status: 'error',
    duration: 9000,
    isClosable: true,
    position: "top-right"
  })
}

export function toastInfo(message: string) {
  toast({
    title: message,
    status: 'info',
    duration: 9000,
    isClosable: true,
    position: "top-right"
  })
}
