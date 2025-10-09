import React, { useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { toastError } from "components/toast/popUp";
import { AiOutlineDownload } from "react-icons/ai";
import { Button } from "@chakra-ui/react";

type Prop = {
  apiData?: any;
  setReload: any;
  fileName?: string;
};
export const ExportButton = ({ apiData, fileName, setReload }: Prop) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = (apiData: any, fileName: any) => {
    if (apiData.length === 0) {
      return toastError("не могу экспортировать");
    }
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs.saveAs(data, fileName + fileExtension);
  };

  const handleChange = () => setReload?.(true);

  useEffect(() => {
    if (apiData.length !== 0) {
      exportToExcel(apiData, fileName);
    }
  }, [apiData]);

  return (
    <Button
      onClick={handleChange}
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
  );
};
