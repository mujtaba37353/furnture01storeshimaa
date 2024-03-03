import { useParams } from "react-router-dom";
import { useGetSectionByIdQuery } from "../../api/section.api";
import { Box, CircularProgress, Paper } from "@mui/material";
import ShowPolicies from "../../Components/SiteContent/ShowPolicies";
import ShowContent from "../../Components/SiteContent/ShowContent";

function ShowContentPage() {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetSectionByIdQuery(id);
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!isSuccess) {
    return <Box sx={{ p: 2 }}>invalid id</Box>;
  }

  const type = data?.data?.type;
  if (
    type === "aboutus" ||
    type === "usage" ||
    type === "privacy" ||
    type === "public" ||
    type === "retrieval"
  ) {
    return <ShowPolicies data={data?.data} />;
  }
  if (type === "slider" || type === "banner") {
    return <ShowContent data={data?.data} />;
  }
  return <Paper sx={{ p: 2 }}>Not Valid Type</Paper>;
}

export default ShowContentPage;
