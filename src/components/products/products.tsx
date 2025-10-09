import { Button, HStack, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { AddProduct } from "./add";
import { ShowGood } from "./show";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useMutation, useQuery } from "react-query";
import productService from "server/product";
import { ErrorCard } from "components/errorCard";
import { ProductResponse } from "types/product.types";

type Props = {
  add: object | boolean;
  setAdd: any;
  setFile: (e: any) => void;
  setReload: (e: boolean) => void;
  reload: boolean;
};

export function Products({ add, setAdd, setFile, reload, setReload }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
  };

  const { isLoading, isError, refetch, data }: any = useQuery({
    queryKey: ["products_getAll", page],
    queryFn: () => productService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery({
    queryKey: ["products_export"],
    queryFn: () => productService.getAll(),
    enabled: reload
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => productService.delete(deleteId.id),
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
      renderCell: (data: ProductResponse) => data.name_ru,
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "description",
      headerName: "Описание",
      renderCell: (data: ProductResponse) => data.description_ru,
    },
    {
      field: "price",
      headerName: "Цена",
      renderCell: (data: ProductResponse) => data.price + " YC",
    },
    {
      field: "category_name",
      headerName: "Категория",
      renderCell: (data: ProductResponse) => (
        <Tag fontSize="12px" border="1px solid #46BB0C" color="#46BB0C" bg="#ECFFD8">
          {data?.categories.name_ru}
        </Tag>
      ),
    },
    {
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: ProductResponse) => (
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
      const data = refetchData.data.data?.map((i: ProductResponse) => ({
        Название: i.name_ru,
        Описание: i.description_ru,
        Цена: i.price,
        Категория: i.categories.name_ru,
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
      {add && <AddProduct refetch={refetch} open={add} close={() => setAdd(false)} />}
      {show && <ShowGood open={show} close={() => setShow(false)} />}
    </>
  );
}
