import { Box, Paper, Typography, useTheme, ButtonBase, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../Components/Breadcrumbs';
import AddIcon from "@mui/icons-material/Add";
import ToolsContents from './ToolsContents';
import { ToolsModal } from './ToolsModal';
import { useGetMetaAnalyticsQuery } from '../../api/toolsApi';

const Tools = () => {
    const { i18n: { language }, } = useTranslation();
    const { data } = useGetMetaAnalyticsQuery();
    const { customColors } = useTheme();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleAddTools = () => { setOpen(true) }

    return (
        <Box sx={{
            px: "20px", minHeight: "100vh"
        }}>
            <Box sx={{ py: "40px" }}>
                <Breadcrumbs page_ar={"الأدوات"} page_en={"Tools"} />
            </Box>
            <Box textAlign={"center"}>
                <ButtonBase
                    onClick={handleAddTools}
                    disabled={data?.data?.length === 5}
                    sx={{
                        bgcolor: data?.data?.length === 5 ? "gray !important" : customColors.main,
                        color: "#fff",
                        width: "fit-content",
                        alignSelf: "flex-end",
                        p: "0.6rem 2rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        "&:hover": { bgcolor: customColors.main },
                        borderRadius: "10px"
                    }}
                >
                    <Stack direction={"row"} sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2px"
                    }}>


                        <Typography sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {language === "ar" ? "اضافة" : "Add"}
                        </Typography>

                        {<AddIcon />}
                    </Stack>
                </ButtonBase>
            </Box>

            <ToolsContents />

            <ToolsModal open={open} handleClose={handleClose} />

        </Box>
    )
}

export default Tools