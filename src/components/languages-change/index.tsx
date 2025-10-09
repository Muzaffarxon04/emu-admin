import { Box } from "@chakra-ui/react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { changeDefaultLang } from "redux/slices/lang";

const LanguageChange = () => {
  const dispatch = useDispatch();
  const { languages, defaultLang } = useSelector((state: any) => state.lang, shallowEqual);

  const handleChange = (e: string) => {
    if (e !== null) dispatch(changeDefaultLang(e));
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid #D0D5DD"
      borderRadius="8px"
      padding="6px 14px"
      bg="#fff"
      gap="4px"
      boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
      w="110px"
    >
      {languages?.map((item: any, index: number) => (
        <Box
          fontSize="14px"
          fontWeight="700"
          cursor="pointer"
          border={defaultLang === item.shortcode ? "1px solid #46BB0C" : "1px solid #fff"}
          color={defaultLang === item.shortcode ? "#46BB0C" : "#000"}
          padding="4px"
          borderRadius="4px"
          key={index}
          onClick={() => handleChange(item.shortcode)}
        >
          {item.locale}
        </Box>
      ))}
    </Box>
  );
};

export default LanguageChange;
