import { Box, Modal, Typography, useTheme } from '@mui/material'
import React from 'react'
import ToolsAdding from './ToolsAdding'
import { useTranslation } from 'react-i18next'

export const ToolsModal = ({ open, handleClose }) => {
const [_,{language:lang}]=useTranslation()
const { customColors } = useTheme();
    return (
        <Box >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left:lang==="en"?{xs:"50%",md:"55%"}:{xs:"50%",md:"45%"},
                        transform: 'translate(-50%, -50%)',
                        width:{xs:"90%",md:"50%"},
                        // bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius:"10px",
                        bgcolor:customColors.container ,
                    }}>
                    <ToolsAdding handleClose={handleClose}/>
                </Box>
            </Modal>
        </Box>
    )
}
