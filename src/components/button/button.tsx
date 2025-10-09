import { Button } from "@chakra-ui/react";
import styles from "./styles.module.scss";

type Props = {
  onClick?: (e: any) => void;
  mode?: "send" | "cancel" | "";
  type?: "button" | "submit";
  load?: boolean;
  children: React.ReactNode;
  bg?: string;
  disabled?: boolean;
  minW?: number | string;
  h?: number | string;
  w?: number | string;
  _hover?: object;
  p?: number | string;
  color?: string;
  fontWeight?: string | number;
  fontSize?: string;
};

export function Btn({ onClick, mode = "", children, type = "button", load, ...rest }: Props) {
  const handleClick = (e: any) => {
    if (rest.disabled) {
      return;
    }
    onClick?.(e);
  };

  return (
    <Button
      isLoading={load}
      type={type}
      onClick={handleClick}
      opacity={rest?.disabled ? 0.5 : 1}
      cursor={rest?.disabled ? "not-allowed" : "pointer"}
      className={`${styles[mode]}`}
      padding="0"
      {...rest}
    >
      {children}
    </Button>
  );
}
