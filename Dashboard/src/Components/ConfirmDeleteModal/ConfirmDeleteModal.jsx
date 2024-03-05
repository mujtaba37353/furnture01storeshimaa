import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfirmDeleteModal({
  open,
  setOpen,
  handleDelete,
  deleteLoading,
}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { customColors, colors, palette } = useTheme();
  const [_, { language: lang }] = useTranslation();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: customColors.bg,
    boxShadow: 24,
    p: 3,
    borderRadius: "10px",
  };
  return (
    <div>
      <Button
        size="small"
        sx={{
          backgroundColor: "transparent !important",
          fontWeight: "bold",
          minWidth: "0",
        }}
        onClick={handleOpen}
      >
        <DeleteIcon sx={{ color: customColors.dangerous }} />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, direction: lang === "en" ? "ltr" : "rtl" }}>
          <Typography
            variant="h6"
            size={"large"}
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {lang === "en" ? "Are sure for delete?" : "هل أنت متأكد من الحذف؟"}
          </Typography>
          <Stack
            flexDirection={"row"}
            justifyContent={"center"}
            mt={3}
            gap={2}
          >
            <Button
              sx={{
                bgcolor: `${customColors.dangerous} !important`,
                color: "#fff",
              }}
              disabled={deleteLoading}
              onClick={handleDelete}
            >
              {lang === "en" ? "Sure" : "تأكيد"}
            </Button>
            <Button
              sx={{
                bgcolor: `transparent !important`,
                color: customColors.main,
                border: `1px solid ${customColors.main}`,
              }}
              onClick={handleClose}
            >
              {lang === "en" ? "Cancel" : "إلغاء"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
