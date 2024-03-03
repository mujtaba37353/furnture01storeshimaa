import { Box, Container } from "@mui/material";
import AreaChart from "./AreaChart";
import PolarChart from "./PolarChart";
import History from "./History";
import HomeOrders from "./HomeOrders";
import MostSellingHome from "./MostSellingHome";
import GeoChart from "./GeoChart";

const Home = () => {
  return (
    // <Container sx={{ py: 5, gap: 5, display: 'flex', flexDirection: 'column' }}>
    // </Container>

    <Box
      sx={{ py: 5, px: 5, gap: 5, display: "flex", flexDirection: "column" }}
    >
      <History />
      <Box container>
        <GeoChart />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <AreaChart />
        <PolarChart />
      </Box>
      <Box container>
        <HomeOrders />
        <MostSellingHome />
      </Box>
    </Box>
  );
};

export default Home;
