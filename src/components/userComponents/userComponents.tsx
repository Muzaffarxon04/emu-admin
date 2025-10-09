import { Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { AddUser } from "./add";
import { ShowUser } from "./show";
import { useMutation, useQuery } from "react-query";
import { toastError, toastSuccess } from "components/toast/popUp";
import userService from "server/user";
import { ErrorCard } from "components/errorCard";
import { formatPhoneNumber } from "hooks/formatPhone";

type Props = {
  add: object | boolean;
  setAdd: any;
  file: any;
  setFile: (e: any) => void;
  setReload: (e: boolean) => void;
  reload: boolean;
};

export function UserComponent({ add, setAdd, setFile, file, setReload, reload }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
    role: "master",
  };

  const { isLoading, isError, refetch, data } = useQuery<any>({
    queryKey: ["master_getAll", page],
    queryFn: () => userService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["master_export"],
    queryFn: () => userService.getAll({ role: "master" }),
    enabled: reload,
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => userService.delete(deleteId.id),
    onSuccess: () => {
      toastSuccess("Успешно удалено!");
      refetch();
      setDeleteID(false);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const columns = [
    {
      field: "first_name",
      headerName: "Имя",
    },
    {
      field: "last_name",
      headerName: "Фамилия",
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: any) => formatPhoneNumber(String(data.phone)),
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

  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: any) => ({
        Имя: i.first_name,
        Фамилия: i.last_name,
        "Номер телефона": i.phone,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

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
        refetch={refetch}
        error={isError}
      />
      <DeleteModal
        load={deleteLoad}
        open={deleteId}
        close={() => setDeleteID(false)}
        handleSubmit={deleteFn}
      />
      {add && <AddUser refetch={refetch} open={add} close={() => setAdd(false)} />}
      {show && <ShowUser open={show} close={() => setShow(false)} />}
    </>
  );
}
