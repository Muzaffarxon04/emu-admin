import { useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import { toastError } from "components/toast/popUp";
import { useMutation } from "react-query";
import eventService from "server/events";

export const ExportByID = ({ id, setByID }: { id: any; setByID: any }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const { mutate: expoFn } = useMutation({
    mutationFn: (idx) =>
      eventService.export({
        event_id: idx,
      }),
    onSuccess: (res) => {
      const apiData = res?.data?.map((i: any) => ({
        name: (i.users?.first_name || "") + " " + (i.users?.last_name || ""),
        status: i.status,
      }));
      exportToExcel(apiData, "events");
    },
    onError: (err: any) => toastError(err?.data?.detail?.detail),
  });

  const exportToExcel = (apiData: any, fileName: any) => {
    if (apiData.length === 0) {
      return toastError("не могу экспортировать");
    }

    const ws = XLSX.utils.json_to_sheet(apiData);

    // Har bir qatordagi status ustunini formatlash
    apiData.forEach((row: any, rowIndex: number) => {
      const cellRef = XLSX.utils.encode_cell({ c: 1, r: rowIndex + 1 }); // 'B' ustuni (status ustuni)

      if (!ws[cellRef]) ws[cellRef] = {};
      switch (row.status) {
        case "approved":
          ws[cellRef].s = getCellStyle("146129"); // Yashil
          break;
        case "pending":
          ws[cellRef].s = getCellStyle("ffd800"); // Sariq
          break;
        case "rejected":
          ws[cellRef].s = getCellStyle("ff0000"); // Qizil
          break;
        default:
          // Standart rang
          break;
      }
    });

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName + fileExtension);
    setByID(null);
  };

  const getCellStyle = (rgbColor: any) => {
    return {
      fill: {
        patternType: "solid",
        fgColor: { rgb: rgbColor },
      },
      font: {
        color: { rgb: "FFFFFF" }, // Oq rangli matn
      },
    };
  };

  useEffect(() => {
    if (id) {
      expoFn(id);
    }
  }, [id, expoFn]);

  return null; // Agar siz hech narsa ko'rsatishni istamasangiz
};
