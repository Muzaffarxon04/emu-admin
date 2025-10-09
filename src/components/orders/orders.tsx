import { Button, HStack, Select, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { DataTable } from "components/dataTable";
import { ShowBuy } from "./show";
import { useMutation, useQuery } from "react-query";
import orderService from "server/order";
import { ErrorCard } from "components/errorCard";
import { OrderResponse } from "types/order.types";
import { formatPhoneNumber } from "hooks/formatPhone";
import { Badge } from "components/badge";
import { toastError, toastSuccess } from "components/toast/popUp";
import { statusList } from "./status";

type Props = {
  page: number;
  setFile: (e: any) => void;
  setPage: (e: any) => void;
  refetch: any;
  setReload: (e: boolean) => void;
  isLoading: boolean;
  reload: boolean;
  data: any;
  isError: boolean;
};

export function Orders({
  setFile,
  setReload,
  reload,
  page,
  setPage,
  data,
  isError,
  refetch,
  isLoading,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [show, setShow] = useState<any>(false);

  const { mutate: updateStatus } = useMutation({
    mutationFn: (data: any) =>
      orderService.update(data.id, {
        order_status: data.data,
      }),
    onSuccess: () => {
      toastSuccess("Статус успешно завершено!");
      refetch();
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const { refetch: expoRefetch } = useQuery<any>({
    queryKey: ["orders_export", page],
    queryFn: () => orderService.getAll(),
    enabled: reload,
  });

  const columns = [
    {
      field: "name",
      headerName: "Название товара",
      renderCell: (data: OrderResponse) =>
        data.order_status === "new" ? (
          <Badge> {data.products.name_ru}</Badge>
        ) : (
          data?.products?.name_ru
        ),
      width: "180px",
    },
    {
      field: "price",
      headerName: "Цена",
      renderCell: (data: OrderResponse) => `${data?.products?.price * data?.count} YC`,
    },
    {
      field: "price",
      headerName: "Количество",
      renderCell: (data: OrderResponse) => `${data?.count}`,
    },
    {
      field: "id",
      headerName: "Товар ID",
      renderCell: (data: OrderResponse) => data.products.id,
    },
    {
      field: "user",
      headerName: "Пользователь",
      renderCell: (data: OrderResponse) =>
        (data.users.first_name || "") + " " + (data.users.last_name || ""),
    },
    {
      field: "phone",
      headerName: "Номер телефона",
      renderCell: (data: OrderResponse) => formatPhoneNumber(data.users.phone),
    },
    {
      field: "status",
      headerName: "Статус",
      renderCell: (data: OrderResponse) => (
        <Select
          onClick={(e: any) => {
            console.log("e", e.target.value);

            if (e.target.value === "") {
              return;
            }
            updateStatus({ id: data.id, data: e.target.value });
          }}
          placeholder={
            statusList.map((i: any) => (i.value === data?.order_status ? i.title : "")) ||
            "Выберите статус"
          }
          fontWeight={700}
          color={"#000"}
          borderColor={statusList.map((i: any) => i.value === data?.order_status && i.color)}
          bg={statusList.map((i: any) => i.value === data?.order_status && i.bg)}
        >
          {statusList
            .filter((x: any) => x.value !== data?.order_status)
            .filter((x: any) => x.value !== "new")
            .map((i: any) => (
              <option key={i.id} value={i.value}>
                {i.title}
              </option>
            ))}
        </Select>
      ),
    },
    {
      field: "system",
      headerName: "",
      width: "120px",
      renderCell: (data: OrderResponse) => (
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
      const data = refetchData.data.data?.map((i: OrderResponse) => ({
        "Название товара": i?.products?.name_ru,
        "Товар ID": i?.product_id,
        Цена: i?.products?.price + " " + "YC",
        Пользователь: i?.users?.last_name,
        "Номер телефона": formatPhoneNumber(i?.users?.phone),
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

      {show && <ShowBuy open={show} close={() => setShow(false)} />}
    </>
  );
}
