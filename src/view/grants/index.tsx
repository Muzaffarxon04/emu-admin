import { Button, HStack, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineDownload, AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GlobalContainer } from "components/globalContainer";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { AddEvents } from "./add";
import { ShowEvents } from "./show";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useMutation, useQuery } from "react-query";
import grandService from "server/grand";
import { GrandResponse } from "types/grand.types";

const MyTable = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [add, setAdd] = useState<any>(false);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [file, setFile] = useState();
  const [reload, setReload] = useState(false);
  const [grantReload, setGrantReload] = useState<boolean>(false);
  const [grantID, setGrantID] = useState<number | null>(null);

  const params = {
    page: page,
    limit: 10,
  };

  const { isLoading, isError, data, refetch } = useQuery<any>({
    queryKey: ["grands_getAll", page],
    queryFn: () => grandService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["grands_export"],
    queryFn: () => grandService.getAll(),
    enabled: reload,
  });

  const { refetch: grandRefetch } = useQuery<any>({
    queryKey: ["grand_export"],
    queryFn: () =>
      grandService.export({
        grand_id: grantID,
      }),
    onSuccess: () => {
      setGrantID(null);
    },
    enabled: grantReload,
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => grandService.delete(deleteId.id),
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
      renderCell: (data: GrandResponse) => data.name_ru,
    },
    {
      field: "description",
      headerName: "Описание",
      renderCell: (data: GrandResponse) => data.description_ru,
    },
    {
      field: "form_link",
      headerName: "Ссылка на форму",
      width: "100px",
      renderCell: (data: GrandResponse) => (
        <Link color="#46BB0C" target="_blank" href={data.form_link}>
          Ссылка
        </Link>
      ),
    },
    {
      field: "count_applications",
      headerName: "Количество заявок",
      width: "100px",
    },
    {
      field: "system",
      headerName: "",
      width: "130px",
      renderCell: (data: GrandResponse) => (
        <HStack gap={0}>
          <Button
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
            onClick={() => {
              setGrantID(data?.id);
              setGrantReload(true);
            }}
          >
            <AiOutlineDownload size={18} />
          </Button>
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

  //  export all grants
  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: GrandResponse) => ({
        Название: i.name_ru,
        Описание: i.description_ru,
        "Ссылка на форму": i.form_link,
        "Количество заявок": i.count_applications,
        Id: i.id,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  //  export get by id grant
  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await grandRefetch();
      const data = refetchData.data.data?.map((i: any) => ({
        Пользователь: i.users.first_name + " " + i.users.last_name,
        Название: i.grands.name_ru,
        "Ссылка на форму": i.grands.form_link,
      }));
      setFile(data);
      setGrantReload(false);
    };

    if (grantReload) fetchData();
  }, [grantReload]);

  return (
    <GlobalContainer
      btnClick={() => setAdd(true)}
      apiData={file}
      fileName="grands"
      setReload={setReload}
    >
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
