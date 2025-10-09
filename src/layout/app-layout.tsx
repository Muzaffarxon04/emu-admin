import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "components/hearder";
import { Loading } from "components/loading";
import { Box } from "@chakra-ui/react";

const AppLayout = () => {
  return (
    <Box>

      <Header />



      <Box>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default AppLayout;
