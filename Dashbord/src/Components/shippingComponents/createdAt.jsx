import { Box, Stack } from '@mui/material';
import React from 'react'

export default function CreatedAt({
    orderShippingDetails,
    lng,
    mode
}) {
    console.log(orderShippingDetails,'orderShippingDetails')
 
    const createdAt = "2024-01-28T09:59:30.897Z";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };

    const formattedDate = new Date(orderShippingDetails?.createdAt).toLocaleString('en-US',options);
    console.log(formattedDate);
    return (
   <>
   
   <Stack sx={{
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            justifyContent: 'flex-end',
            textTransform:'capitalize',
            fontWeight:'bold',
            textAlign:'center',
            width:'100%',
            justifyContent:'flex-start',
            alignItems:'flex-start',
            marginBottom:'20px',
            color:'green',
            fontSize:'12px'
         }}>
        
        {
            lng==="en"?"Order Created At":"تم انشاء الطلب في"
        }:

        <Box sx={{
            color:mode==="dark"?'#Fff':"#333",
            fontSize:{
                xs:'11px',
                md:'13px'
            }
        }}>
        {formattedDate}

        </Box>
        </Stack>
    </>

  )
}
