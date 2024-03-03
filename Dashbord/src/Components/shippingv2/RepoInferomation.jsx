import { Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './index.css'
export default function RepoInferomation({ orderShippingDetails,lng }) {
       return (
        <Stack >
        <Typography sx={{
            marginBottom:'10px',
            fontWeight:'bold'
        }}>
            {
                lng!=="en"?"بيانات المستودع":' Repository Inferomation '
            }
        </Typography>
            <Grid container sx={{
                 padding:'10px 5px',
                borderRadius:'8px',
             }}>

                <Grid container xs={12}>

                    <Grid item xs={12} md={6}  sx={{
                                    fontWeight:'bold'

                    }}>
                        {lng === "en" ? "status" : " الحاله"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            orderShippingDetails?.active ? "Active" : "Diss Active"
                        }
                    </Grid>
                </Grid>
                <Divider className='dividers' sx={{    borderWidth: '0px',   borderColor: '##ddd',  width: '100%', }}/> 
                <Grid container xs={12}>

                    <Grid item xs={12} md={6} sx={{
                                    fontWeight:'bold'

                    }} >
                        {lng === "en" ? "Repo Type" : "نوع المستودع"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            orderShippingDetails?.type
                        }
                    </Grid>
                </Grid>
                <Divider className='dividers' sx={{    borderWidth: '0px',   borderColor: '##ddd',  width: '100%', }}/> 

                <Grid container xs={12}>
                    <Grid item xs={12} md={6}  sx={{
                                    fontWeight:'bold'

                    }}>
                        {lng === "en" ? "Name" : "الاسم"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            lng === "en" ? orderShippingDetails?.name_en : orderShippingDetails?.name_ar
                        }
                    </Grid>
                </Grid>
                <Divider className='dividers' sx={{    borderWidth: '0px',   borderColor: '##ddd',  width: '100%', }}/> 

                <Grid container xs={12}>
                    <Grid item xs={12} md={6}  sx={{
                                    fontWeight:'bold'

                    }}>
                        {lng === "en" ? "address" : "العنوان"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            orderShippingDetails?.address
                        }
                    </Grid>
                </Grid>
                <Divider className='dividers' sx={{    borderWidth: '0px',   borderColor: '##ddd',  width: '100%', }}/> 

                <Grid container xs={12}>
                    <Grid item xs={12} md={6}  sx={{
                                    fontWeight:'bold'

                    }}>
                        {lng === "en" ? "city" : "المدينه"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            orderShippingDetails?.city
                        }
                    </Grid>
                </Grid>
                <Divider className='dividers' sx={{    borderWidth: '0px',   borderColor: '##ddd',  width: '100%', }}/> 

                <Grid container xs={12}>
                    <Grid item xs={12} md={6} sx={{
                                    fontWeight:'bold'

                    }} >
                        {lng === "en" ? "contactEmail" : "الايميل"}
                    </Grid>
                    <Grid item xs={12} md={6} >

                        {
                            orderShippingDetails?.contactEmail
                        }
                    </Grid>
                </Grid>

 
            </Grid>


         
         </Stack> )
}
