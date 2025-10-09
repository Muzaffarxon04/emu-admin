import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GlobalContainer } from "components/globalContainer";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { AddEvents } from "./add";
import { ShowEvents } from "./show";
import { ErrorCard } from "components/errorCard";
import faqService from "server/faq";
import { useMutation, useQuery } from "react-query";
import { toastError, toastSuccess } from "components/toast/popUp";

const MyTable = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [add, setAdd] = useState<any>(false);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
  };

  const { isLoading, isError, data, refetch } = useQuery<any>({
    queryKey: ["faq_getAll", page],
    queryFn: () => faqService.getAll(params),
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => faqService.delete(deleteId.id),
    onSuccess: () => {
      toastSuccess("Успешно удалено!");
      refetch();
      setDeleteID(false);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const columns = [
    {
      field: "name_ru",
      headerName: "Название",
    },
    {
      field: "description_ru",
      headerName: "Описание",
      width: "100px",
    },
    {
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: any) => (
        <HStack gap={0}>
          <Button
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
            onClick={() => setShow(data)}
          >
            <AiOutlineEye size={18} />
          </Button>
          <Button
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
            onClick={() => setAdd(data)}
          >
            <LuPencilLine size={18} />
          </Button>
          <Button
            bg="transparent"
            onClick={() => setDeleteID(data)}
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
          >
            <RiDeleteBin6Line size={18} />
          </Button>
        </HStack>
      ),
    },
  ];

  return (
    <GlobalContainer expoHidden btnClick={() => setAdd(true)}>
      <>
        <DataTable
          loading={isLoading}
          columns={columns}
          rows={data?.data || []}
          select={selectedIds}
          setSelect={setSelectedIds}
          paginate={data?.pagination}
          setPage={setPage}
          page={page}
          refetch={refetch}
          error={isError}
        />
        <DeleteModal
          load={deleteLoad}
          open={deleteId}
          close={() => setDeleteID(false)}
          handleSubmit={deleteFn}
        />
        {add && <AddEvents refetch={refetch} open={add} close={() => setAdd(false)} />}
        {show && <ShowEvents open={show} close={() => setShow(false)} />}
      </>
    </GlobalContainer>
  );
};

export default MyTable;
