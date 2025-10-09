import { Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { GlobalContainer } from "components/globalContainer";
import { DataTable } from "components/dataTable";
import { ShowEvents } from "./show";
import { useQuery } from "react-query";
import volunteerService from "server/volunteers";
import { formatPhoneNumber } from "hooks/formatPhone";
import { VolunteerResponse } from "types/volunteer.types";

const MyTable = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [file, setFile] = useState([]);
  const [reload, setReload] = useState(false);

  const params = {
    page: page,
    limit: 10,
  };

  const { isLoading, isError, data, refetch } = useQuery<any>({
    queryKey: ["faq_getAll", page],
    queryFn: () => volunteerService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["faq_export"],
    queryFn: () => volunteerService.getAll(params),
    enabled: reload,
  });

  const columns = [
    {
      field: "user",
      headerName: "Пользователь",
      renderCell: (data: VolunteerResponse) =>
        (data?.users?.first_name || "") + " " + (data?.users?.last_name || ""),
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: VolunteerResponse) => formatPhoneNumber(String(data?.users?.phone)),
    },
    {
      field: "email",
      headerName: "E-mail",
      renderCell: (data: VolunteerResponse) => data?.users?.email,
    },
    {
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: VolunteerResponse) => (
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
        </HStack>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const refetchData: any = await expoRefetch();
      const data = refetchData.data.data?.map((i: VolunteerResponse) => ({
        Пользователь: (i?.users?.first_name || "") + " " + (i?.users?.last_name || ""),
        ID: i.id,
        "Номер телефона": i?.users.phone,
        "E-mail": i?.users?.email,
      }));
      setFile(data);
      setReload(false);
    };

    if (reload) fetchData();
  }, [reload]);

  return (
    <GlobalContainer btnHidden apiData={file} fileName="volunteer" setReload={setReload}>
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
        {show && <ShowEvents open={show} close={() => setShow(false)} />}
      </>
    </GlobalContainer>
  );
};

export default MyTable;
