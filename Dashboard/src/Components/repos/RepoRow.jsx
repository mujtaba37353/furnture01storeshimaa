import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDeleteRepoMutation } from "../../api/repos.api";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import EditRepoistoryModal from "./EditRepoModal";
const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const RepoRow = ({ repo, index }) => {
  const {
    i18n: { language },
  } = useTranslation();
  const { colors, customColors } = useTheme();
  const { role } = useSelector((state) => state.user);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openRepoProducts, setOpenRepoProducts] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedEdited, setSelectedEdited] = useState();
  const [deleteRepo] = useDeleteRepoMutation();
  const [openedRepo, setOpenedRepo] = useState();
  const handleRemoveRepo = () => {
    deleteRepo(repo._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
      })
      .catch((error) => {
        toast.error(error.data[`success_${language}`]);
      });
  };
  const handleOpenRepoProductsModal = (item) => {
    setOpenedRepo(item);
    setOpenRepoProducts(true);
  };
  const handleSelectRepoForEdit = (item) => {
    setSelectedEdited(item);
    setEditModal(true);
  };
  const arabicReposNames = { warehouse: "مستودع", branch: "فرع" };
  return (
    <>
      {/* Adding product to repo */}
      <EditRepoistoryModal
        open={editModal}
        setOpen={setEditModal}
        selectedItem={selectedEdited}
        setSelectItem={setSelectedEdited}
      />

      <TableRow
        sx={{
          bgcolor: customColors.bg,
        }}
      >
        <TableCell align="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {language === "en" ? repo?.name_en : repo?.name_ar}
        </TableCell>
        <TableCell align="center" colSpan={2}>
          {language === "en" ? repo?.type : arabicReposNames[repo?.type]}
        </TableCell>
        <TableCell align="center">{repo?.city}</TableCell>
        <TableCell align="center">{repo?.address}</TableCell>
        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {allowed({ page: "repositories", role }) ? (
              <BootstrapTooltip
                title={
                  language === "en"
                    ? "Edit this repository"
                    : "تعديل هذا المستودع"
                }
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  onClick={() => handleSelectRepoForEdit(repo)}
                >
                  <EditIcon
                    sx={{
                      color: "#00e3d2",
                      cursor: "pointer",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}

            {allowed({ page: "repositories", role }) ? (
              <BootstrapTooltip
                title={
                  language === "en"
                    ? "Delete this repository."
                    : "حذف هذا المستودع"
                }
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                >
                  <DeleteIcon
                    sx={{
                      color: colors.dangerous,
                      cursor: "pointer",
                    }}
                    onClick={handleRemoveRepo}
                  />
                </Button>
              </BootstrapTooltip>
            ) : undefined}
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RepoRow;
