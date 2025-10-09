import { Box, IconButton, Text } from "@chakra-ui/react";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";

type Paginate = {
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_items: number;
  total_pages: number;
};

type Props = {
  paginate: Paginate | any;
  setPage: (page: any) => void;
  dataLength: number;
};

const Pagination = ({ paginate, setPage, dataLength }: Props) => {
  // console.log("paginate =>>>", paginate);
  return (
    <Box
      bg="#fff"
      w="100%"
      h="52px"
      mt="10px"
      borderRadius="10px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p="0 15px"
    >
      <Box display="flex" alignItems="center">
        <Text color="#82868C" fontSize="14px">
          Показано:
        </Text>
        <Text fontSize="14px" fontWeight={700} pl={2}>
          {(paginate?.current_page === paginate?.total_pages
            ? paginate?.total_items
            : paginate?.current_page * 10) || dataLength}{" "}
          из {paginate?.total_items || 0}{" "}
        </Text>
      </Box>
      <Box display="flex" alignItems="center">
        <IconButton
          aria-label="left"
          bg="transparent"
          _hover={{
            bg: "transparent",
          }}
          cursor={paginate?.current_page === 1 ? "not-allowed" : "pointer"}
          minW={30}
          color="#46BB0C"
          mr="5px"
          icon={<TfiArrowCircleLeft size={24} />}
          onClick={() => paginate?.current_page !== 1 && setPage((prev: number) => prev - 1)}
        />

        <Text m="0 10px" fontSize="14px">
          {paginate?.current_page || 0} из {paginate?.total_pages || 0}
        </Text>

        <IconButton
          aria-label="right"
          bg="transparent"
          _hover={{
            bg: "transparent",
          }}
          minW={30}
          cursor={paginate?.current_page === paginate?.total_pages ? "not-allowed" : "pointer"}
          color="#46BB0C"
          icon={<TfiArrowCircleRight size={24} />}
          onClick={() =>
            paginate?.current_page !== paginate?.total_pages && setPage((prev: number) => prev + 1)
          }
        />
      </Box>
    </Box>
  );
};

export default Pagination;
