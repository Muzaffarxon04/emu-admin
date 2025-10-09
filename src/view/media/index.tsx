import { Box, Text } from "@chakra-ui/react";
import { Btn } from "components/button";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { GlobalContainer } from "components/globalContainer";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import mediaService from "server/media";
import MediaUpload from "./mediaUpload";

const MyTable = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const {
    isLoading,
    isError,
    refetch,
    data: media,
  } = useQuery<any>({
    queryKey: ["media_getAll"],
    queryFn: () => mediaService.getAll(),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => mediaService.delete(deleteId.id),
    onSuccess: () => {
      toastSuccess("Успешно удалено!");
      refetch();
      setDeleteID(false);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const columns = [
    {
      field: "name",
      headerName: "Название",
      renderCell: (data: any) => data?.name,
      minW: "200px",
    },
    {
      field: "option",
      headerName: "",
      end: true,
      renderCell: (data: any) => (
        <Box gap={0} border={"none"}>
          <Btn
            bg="transparent"
            onClick={() => setDeleteID(data)}
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
          >
            <RiDeleteBin6Line size={18} />
          </Btn>
        </Box>
      ),
    },
  ];

  console.log("media =>>>", media);
  return (
    <GlobalContainer btnHidden expoHidden>
      <Box pt="30px">
        <Box borderRadius={"8px"} bg={"#fff"} overflow={"hidden"} p={"20px 35px"}>
          <Box>
            <Text mb={"12px"} fontSize={"18px"} fontWeight={"700"}>
              Загрузить
            </Text>
          </Box>
          <MediaUpload refetch={refetch} error={isError} />
        </Box>

        <DataTable
          page={page}
          error={isError}
          refetch={refetch}
          setPage={setPage}
          columns={columns}
          loading={isLoading}
          select={selectedIds}
          rows={media?.data || []}
          setSelect={setSelectedIds}
          paginate={media?.pagination}
        />

        <DeleteModal
          load={deleteLoad}
          open={deleteId}
          close={() => setDeleteID(false)}
          handleSubmit={deleteFn}
        />
      </Box>
    </GlobalContainer>
  );
};

export default MyTable;
