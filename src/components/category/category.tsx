import { Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { AddCategory } from "./add";
import { ShowCategory } from "./show";
import { ErrorCard } from "components/errorCard";
import categoryService from "server/category";
import { useMutation, useQuery } from "react-query";
import { toastError, toastSuccess } from "components/toast/popUp";
import { CategoryResponse } from "types/category.types";

type Props = {
  add: object | boolean;
  setAdd: any;
  setFile: (e: any) => void;
  setReload: (e: boolean) => void;
  reload: boolean;
};

export function Category({ add, setAdd, setFile, setReload, reload }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
  };

  const { isLoading, isError, refetch, data } = useQuery<any>({
    queryKey: ["category_getAll", page],
    queryFn: () => categoryService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["category_export", page],
    queryFn: () => categoryService.getAll(),
    enabled: reload
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => categoryService.delete(deleteId.id),
    onSuccess: () => {
      toastSuccess("Удаление выполнено!");
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
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: CategoryResponse) => (
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

  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: CategoryResponse) => ({
        Название: i.name_ru,
        Id: i.id,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  if (isError) {
    return <ErrorCard onReset={() => refetch()} />;
  }

  return (
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
      />
      <DeleteModal
        load={deleteLoad}
        open={deleteId}
        close={() => setDeleteID(false)}
        handleSubmit={deleteFn}
      />
      {add && <AddCategory refetch={refetch} open={add} close={() => setAdd(false)} />}
      {show && <ShowCategory open={show} close={() => setShow(false)} />}
    </>
  );
}
