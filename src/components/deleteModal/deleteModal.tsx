import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { Links } from "components/hearder/data";
import { useLocation } from "react-router-dom";

type Props = {
  open: any;
  text?: string,
  close: () => void;
  handleSubmit: () => void;
  load?: boolean
};

const OverlayOne = () => (
  <ModalOverlay
    bg='blackAlpha.300'
    backdropFilter='blur(10px) hue-rotate(90deg)'
  />
)

export function DeleteModal({ open, close, handleSubmit, text, load }: Props) {
  const location = useLocation();
  const path = location.pathname.substring(1);
  return (
    <Modal isOpen={open} onClose={close} isCentered size={'2xl'}>
      <OverlayOne />
      <ModalContent>
        <ModalBody m='26px 91px 88px 91px' color="#000" fontSize="30px" fontWeight="700" textAlign='center'>
        Удалить выбранный {text ? text : Links.find((i) => i.url === path)?.title}?
        </ModalBody>

        <ModalFooter gap="21px">
          <Button
            onClick={close}
            w="100%"
            border="1px solid #46BB0C"
            bg="transparent"
            p="8px 16px"
            color="#46BB0C"
            fontSize="16px"
            fontWeight="700"
            _hover={{
              bg: "transparent",
            }}
          >
            Нет
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={load}
            w="100%"
            bg="#46BB0C"
            p="8px 16px"
            color="#fff"
            fontSize="16px"
            fontWeight="700"
            _hover={{
              bg: "#46BB0C",
            }}
          >
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
