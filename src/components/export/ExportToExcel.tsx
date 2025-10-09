import React, { useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toastError } from "components/toast/popUp";
import { Button, Image } from "@chakra-ui/react";
import Download from "assets/image/download.svg";

type Prop = {
  apiData?: any;
  fileName?: string;
  expoDisable?: boolean;
  expoHidden?: boolean;
  expoLoad?: boolean;
  setReload?: (e: boolean) => void;
};

export const ExportToExcel = ({
  apiData,
  fileName,
  expoDisable,
  expoHidden,
  expoLoad,
  setReload,
}: Prop) => {
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
      disabled={expoDisable}
      isLoading={expoLoad}
      onClick={handleChange}
      rightIcon={<Image src={Download} alt="plus image" />}
      bg="#fff"
      hidden={expoHidden}
      boxShadow="0px 6px 18px 0px rgba(0, 0, 0, 0.06)"
      borderRadius="4px"
      color="#46BB0C"
      fontWeight="700"
      fontSize="16px"
      padding="8px 16px"
      _hover={{
        bg: "#fff",
        color: "#46BB0C",
      }}
    >
      Экспортировать
    </Button>
  );
};
