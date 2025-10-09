import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toastError } from "components/toast/popUp";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const ExportGrant = (apiData: any, fileName: any) => {
  if (apiData.length === 0) {
    return toastError("не могу экспортировать");
  }
  const ws = XLSX.utils.json_to_sheet(apiData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  saveAs.saveAs(data, fileName + fileExtension);
};
