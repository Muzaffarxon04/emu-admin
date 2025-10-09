import { Badge, Button, HStack } from "@chakra-ui/react";
import { Btn } from "components/button";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { GlobalContainer } from "components/globalContainer";
import { toastError, toastSuccess } from "components/toast/popUp";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import storeService from "server/store";
import { EventsResponse } from "types/events.types";
import { AddEvents } from "./add";

const MyTable = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [add, setAdd] = useState<any>(false);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [file, setFile] = useState();
  const [reload, setReload] = useState(false);

  const params = {
    offset: page,
    limit: 10,
  };

  const {
    isLoading,
    isError,
    refetch,
    data: stories,
  } = useQuery<any>({
    queryKey: ["stories_getAll", page],
    queryFn: () => storeService.getAll(params),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["stories_export"],
    queryFn: () => storeService.getAll(),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: reload,
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => storeService.delete(deleteId.id),
    onSuccess: () => {
      toastSuccess("Успешно удалено!");
      refetch();
      setDeleteID(false);
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const columns = [
    {
      field: "description",
      headerName: "Описание",
      renderCell: (data: any) => data?.description,
      minW: "200px",
    },
    {
      field: "is_active",
      headerName: "СТАТУС",
      renderCell: (data: any) => (
        <Badge
          padding={"4px 8px"}
          borderRadius={"4px"}
          colorScheme={data?.is_active ? "green" : "red"}
        >
          {String(data?.is_active)}
        </Badge>
      ),
      minW: "200px",
    },
    {
      field: "option",
      headerName: "",
      end: true,
      renderCell: (data: EventsResponse) => (
        <HStack gap={0} border={"none"}>
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
        </HStack>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: any) => ({
        "Media url": i?.media_url,
        "Is active": i?.is_active,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  console.log("stores =>>>", stories);
  return (
    <GlobalContainer
      btnClick={() => setAdd(true)}
      apiData={file}
      fileName="stories"
      setReload={setReload}
    >
      <>
        <DataTable
          page={page}
          error={isError}
          refetch={refetch}
          setPage={setPage}
          columns={columns}
          loading={isLoading}
          select={selectedIds}
          rows={stories?.data || []}
          setSelect={setSelectedIds}
          paginate={stories?.pagination}
        />

        <DeleteModal
          load={deleteLoad}
          open={deleteId}
          close={() => setDeleteID(false)}
          handleSubmit={deleteFn}
        />
        {(add || show) && (
          <AddEvents
            type={show ? "show" : "add"}
            refetch={refetch}
            open={add ? add : show}
            close={() => (add ? setAdd(false) : setShow(false))}
          />
        )}
      </>
    </GlobalContainer>
  );
};

export default MyTable;
