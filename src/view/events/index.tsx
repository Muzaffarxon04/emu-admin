import { Button, HStack } from "@chakra-ui/react";
import { Btn } from "components/button";
import { DataTable } from "components/dataTable";
import { DeleteModal } from "components/deleteModal";
import { ExportByID } from "components/exportByID/ExportToExcel";
import { GlobalContainer } from "components/globalContainer";
import { toastError, toastSuccess } from "components/toast/popUp";
import dayjs from "dayjs";
import { formatPhoneNumber } from "hooks/formatPhone";
import { useEffect, useState } from "react";
import { AiOutlineDownload, AiOutlineEye, AiOutlineBarChart, AiOutlineUser } from "react-icons/ai";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import eventService from "server/events";
import { EventsResponse } from "types/events.types";
import { AddEvents } from "./add";
import { ShowEvents } from "./show";
import { ScanStatistics } from "./scanStatistics";
import { is } from "date-fns/locale";

const MyTable = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [add, setAdd] = useState<any>(false);
  const [show, setShow] = useState<any>(false);
  const [deleteId, setDeleteID] = useState<any>(false);
  const [scanStatistics, setScanStatistics] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [file, setFile] = useState();
  const [byId, setByID] = useState<any>();
  const [reload, setReload] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const params = {
    page: page,
    limit: 10,
    is_active: isActive,
  };

  const {
    isLoading,
    isError,
    refetch,
    data: events,
  } = useQuery<any>({
    queryKey: ["events_getAll", page, isActive],
    queryFn: () => eventService.getAll(params),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["events_export"],
    queryFn: () => eventService.getAll(),
    onError: (err: any) => toastError(err?.data?.detail?.detail),
    enabled: reload,
  });

  const { mutate: deleteFn, isLoading: deleteLoad } = useMutation({
    mutationFn: () => eventService.delete(deleteId.id),
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
      renderCell: (data: EventsResponse) => data.name_ru,
      minW: "200px",
    },
    {
      field: "description",
      headerName: "Описание",
      renderCell: (data: EventsResponse) => data.description_ru,
      minW: "200px",
    },
    {
      field: "start_date",
      headerName: "Дата",
      renderCell: (data: EventsResponse) => (
        <>
          {data.start_date} <br />
          {data.end_date}
        </>
      ),
    },
    {
      field: "count",
      headerName: "Время",
      renderCell: (data: EventsResponse) => (
        <>
          {data.start_time} <br />
          {data.end_time}
        </>
      ),
    },
    {
      field: "city",
      headerName: "Город",
      renderCell: (data: EventsResponse) => data.cities.name_ru,
    },
    {
      field: "address",
      headerName: "Адрес",
      renderCell: (data: EventsResponse) => data.address_ru,
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: EventsResponse) => formatPhoneNumber(data.phone),
    },
    {
      field: "place",
      headerName: "Места",
    },
    {
      field: "price",
      headerName: "Цена",
      renderCell: (data: EventsResponse) => `${data.price} YC`,
    },
    {
      field: "scores",
      headerName: "Баллы",
      renderCell: (data: EventsResponse) => `${data.scores} YC`,
    },
    {
      field: "created_at",
      headerName: "Дата публикации",
      renderCell: (data: any) => dayjs(data.created_at).format("DD.MM.YYYY"),
      minW: "200px",
    },
    {
      field: "count_applications",
      headerName: "Количество",
      minW: "130px",
    },
    {
      field: "option",
      headerName: "",
      end: true,
      renderCell: (data: EventsResponse) => (
        <HStack gap={0} border={"none"}>
          <Button
            onClick={() => setByID(data?.id)}
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
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
            onClick={() => setScanStatistics(data)}
            title="Скан статистика"
          >
            <AiOutlineBarChart size={18} />
          </Button>
          <Button
            bg="transparent"
            p="0"
            minW={35}
            h={35}
            _hover={{
              bg: "transparent",
            }}
            onClick={() => navigate(`/events/${data.id}`)}
            title="Участники события"
          >
            <AiOutlineUser size={18} />
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
            // disabled={data.count_applications > 0}
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
        Название: i?.name_ru,
        Описание: i?.description_ru,
        "Дата начала": dayjs(i?.start_date).format("DD.MM.YYYY"),
        "Дата окончания": dayjs(i?.end_date).format("DD.MM.YYYY"),
        "Время начала": i?.start_time,
        "Время окончания": i?.end_time,
        Город: i?.cities?.name_ru,
        Адрес: i.address_ru,
        Места: i.place,
        Цена: i.price,
        Баллы: i.scores,
        "Номер телефона": i.phone,
        Id: i.id,
        "Дата публикации": dayjs(i.created_at).format("DD.MM.YYYY"),
        Количество: i.count_applications,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  return (
    <GlobalContainer
      btnClick={() => setAdd(true)}
      apiData={file}
      fileName="events"
      setReload={setReload}
      setIsActive={setIsActive}
      expoHidden={false}
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
          rows={events?.data || []}
          setSelect={setSelectedIds}
          paginate={events?.pagination}
        />

        <DeleteModal
          load={deleteLoad}
          open={deleteId}
          close={() => setDeleteID(false)}
          handleSubmit={deleteFn}
        />
        {add && <AddEvents refetch={refetch} open={add} close={() => setAdd(false)} />}
        {show && <ShowEvents open={show} close={() => setShow(false)} />}
        {scanStatistics && (
          <ScanStatistics open={scanStatistics} close={() => setScanStatistics(false)} />
        )}
        <ExportByID id={byId} setByID={setByID} />
      </>
    </GlobalContainer>
  );
};

export default MyTable;
