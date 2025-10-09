import { Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { DataTable } from "components/dataTable";
import { ShowClient } from "./show";
import userService from "server/user";
import { useQuery } from "react-query";
import { MasterResponse } from "types/master.types";
import { formatPhoneNumber } from "hooks/formatPhone";

type Props = {
  setFile: (e: any) => void;
  setReload: (e: boolean) => void;
  reload: boolean;
};

export function Clients({ setFile, reload, setReload }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);
  const [page, setPage] = useState<number>(1);

  const params = {
    page: page,
    limit: 10,
    role: "user",
  };

  const { isLoading, isError, refetch, data } = useQuery<any>({
    queryKey: ["users_getAll", page],
    queryFn: () => userService.getAll(params),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["users_export", page],
    queryFn: () => userService.getAll({ role: "user" }),
    enabled: reload,
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
      field: "middle_name",
      headerName: "Отчество",
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: MasterResponse) => formatPhoneNumber(String(data.phone)),
    },
    {
      field: "email",
      headerName: "E-mail",
    },
    {
      field: "city",
      headerName: "Город",
      renderCell: (data: MasterResponse) => data.cities?.name_ru,
    },
    {
      field: "dob",
      headerName: "Дата рождения",
    },
    {
      field: "study_in",
      headerName: "Место учебы",
    },
    {
      field: "job",
      headerName: "Место работы",
    },
    {
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: MasterResponse) => (
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
      const data = refetchData.data.data?.map((i: any) => ({
        Имя: i.first_name,
        Фамилия: i.last_name,
        Отчество: i.middle_name,
        "E-mail": i.email,
        "Номер телефона": i.phone,
        Город: i.cities?.name_ru,
        "Дата рождения": i.dob,
        "Место учебы": i.study_in,
        "Место работы": i.job,
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
      {show && <ShowClient open={show} close={() => setShow(false)} />}
    </>
  );
}
