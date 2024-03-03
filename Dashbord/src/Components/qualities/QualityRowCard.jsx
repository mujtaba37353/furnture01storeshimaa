import { TableCell, TableRow, Stack, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { useDeleteQualityByIdMutation } from "../../api/qualities.api";
const QualityRowCard = ({ item, index, handleOpenEditModal }) => {
  const { colors, customColors, palette } = useTheme();
  const [_, { language: lang }] = useTranslation();
  const [deleteQualityById] = useDeleteQualityByIdMutation();
  const { role } = useSelector((state) => state.user);

  const handleRemoveAttribute = () => {
    deleteQualityById(item._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`]);
      });
  };
  return (
    <TableRow
      sx={{
        bgcolor: customColors.bg,
      }}
    >
      <TableCell align="center" sx={{ width: 0.07 }}>
        {index + 1}
      </TableCell>
      <TableCell
        sx={{ width: 0.17, wordBreak: "break-word" }}
        align={lang === "en" ? "left" : "right"}
      >
        {item[`key_${lang}`]}
      </TableCell>
      <TableCell sx={{ width: 0.85 }} align={lang === "en" ? "left" : "right"}>
        <Stack direction={"row"} flexWrap={"wrap"} gap={"10px"}>
          {item.values.map((item, idx) => (
            <Typography
              key={idx}
              sx={{
                wordBreak: "break-word",
              }}
              border={1}
              borderColor={colors.inputBorderColor}
              p={1}
            >
              {item[`value_${lang}`]}
            </Typography>
          ))}
        </Stack>
      </TableCell>

      {allowed({ page: "attributes", role }) ? (
        <TableCell
          sx={{
            color: "gray",
          }}
        >
          <Stack direction={"row"} justifyContent={"center"} gap={"5px"}>
            <EditIcon
              sx={{
                color: "#00e3d2",
                cursor: "pointer",
              }}
              onClick={() => handleOpenEditModal(item)}
            />
            <DeleteIcon
              sx={{
                color: colors.dangerous,
                cursor: "pointer",
              }}
              onClick={handleRemoveAttribute}
            />
          </Stack>
        </TableCell>
      ) : undefined}
    </TableRow>
  );
};

export default QualityRowCard;
