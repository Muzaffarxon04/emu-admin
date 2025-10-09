import { FormLabel } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  htmlFor?: string;
};

export default function Label({ children, htmlFor }: Props) {
  return (
    <FormLabel htmlFor={htmlFor} color="#212732" fontSize="14px" fontWeight="700">
      {children}
    </FormLabel>
  );
}
