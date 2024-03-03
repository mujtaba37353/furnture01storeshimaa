import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import './index.css'
import RepoInferomation from './RepoInferomation';
import CustomerProduct from './customerProduct';
import ShippingItems from './ShippingItems';
import { useTranslation } from 'react-i18next';
import StepperRepos from './StepperRepos';
import CreatedAt from '../shippingComponents/createdAt';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

export default function ShippingTabs({   order,setOpen,setData }) {
    console.log(order,'orsdasd')
    const [value, setValue] = React.useState(0);
    const [finishedShipped ,setFinishedShipped]=useState(false)
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const navigate = useNavigate()
   const [, { language: lng }] = useTranslation();
    const [ordersShipping, setOrderShipping] = React.useState([]);
    const { palette } = useTheme();
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('xl'))
    const [loading,setLoading]=useState(false)
    console.log(palette)
    React.useEffect(() => {
        console.log(order?.ordersShipping, 'order?.ordersShipping', ordersShipping)
        setOrderShipping(order?.ordersShipping)
   

        if(order?.order.length===order?.ordersShipping.length){
            console.log(' sadasd',true)
            setFinishedShipped(true)
        }
 
    }, [ordersShipping, order?.ordersShipping])

    const IsShipped = (item) => {
        return ordersShipping?.some(ordership =>
            ordership?.RepoId === item?.id)
    }
  
    return (
   <>     <Box
   sx={{
       flexGrow: 1,
       display: 'flex', flexDirection: {
           xs: 'column',
           xl: 'row',
       }
   }}
>
   {
       console.log(value, '')
   }
   <Tabs
    onChange={handleChange}

       orientation={
           phoneScreen ? "horizontal" : "vertical"
       }
       variant="scrollable"
       value={value}

       sx={{
           "& .css-jocjzt-MuiTabs-root": {
               background: palette.mode === "dark " ? '#333' : "#fff"

           },
           position: 'sticky',
           top: '-10px',
           background: palette.mode === "dark" ? '#333' : "#fff",
           zIndex:2
       }}
 
   >

       {
           order?.order?.map((item, idx) => {
               return (

                  
                       <Tab sx={{

                           "& .css-1h9z7r5-MuiButtonBase-root-MuiTab-root": {

                               color: '#333'
                           },

                       }}
                       disabled={loading}
                       label={lng === "en" ? item?.RepoInferomation?.name_en : item?.RepoInferomation?.name_ar} key={idx}  {...a11yProps(0)} />

                  
               )
           })
       }

   </Tabs>

   {
       order?.order?.map((item, idx) => {
           return (
               <TabPanel value={value} index={idx} className={
                   palette?.mode === "dark" ? 'panalTapDark' : 'panalTap'
               }  >
                   <StepperRepos mode={palette?.mode} ordersShipping={ordersShipping} stepperRepos={order?.stepperRepos} />

                   <Grid container sx={{

                   }}>

                       <Grid item xs={12} md={6} sx={{
                           height: '500px',
                           overflow: 'hidden',
                           overflowY: 'auto',
                           alignItems: 'center',
                           justifyContent: 'center',
                       }}>
                           <CreatedAt mode={palette?.mode} lng={lng} orderShippingDetails={order?.shippingInferomation} />


                           <ShippingItems setLoading={setLoading} orderItems={item} isShipping={
                               IsShipped(item)
                           }
                               shippingInfo={IsShipped(item) ? ordersShipping[idx] : {}
                               }
                               lng={lng}
                               shippingItems={ordersShipping}
                               setShippingItems={setOrderShipping}
                               setData={setData}
                           />

                       </Grid>

                       {/* <Grid item xs={11}  >
                           products
                       </Grid> */}
                       <Grid item xs={11} md={6} sx={{
                           height: '100%',
                           justifyContent: 'flex-start',
                           display: 'flex',
                           flexDirection: 'column',
                           padding: '10px',
                           marginBottom:'auto'

                       }}>

                           {/* 
isShipping={
                               ordersShipping?.some()
                           } */}
                           <RepoInferomation lng={lng} orderShippingDetails={item?.RepoInferomation} />


                           <CustomerProduct lng={lng} customerInferomation={order?.shippingInferomation} />
                       </Grid>

                   </Grid>









               </TabPanel>)
       })
   }


</Box>
<Stack sx={{
   marginTop:'auto',
   flexDirection:'row',
   width:'100%',
   padding:'10px 20px',
   alignItems:'center'

  }}>
    <Button sx={{
    borderRadius: '0px',
   height: {
       xs: '30px',
      
   },
   fontWeight: 'bold',
    marginTop: 15,
    borderRadius:"6px",
   width:'fit-content',
   textTransform:'capitalize',
   fontSize:'15px',
   color:palette?.mode==="dark" ?"#fff":"#333",
   backgroundColor:'#00D5C5 ',
   color:'#fff',
   "&:hover":{
    color:'#333',
    backgroundColor:'#eee ',

   }
}}
disabled={!finishedShipped}
onClick={()=> {
    
    setOpen(false)
    navigate(`/orders/${order?.shippingInferomation?._id}`)
}}
 >Track Order</Button>
   <Button sx={{
    borderRadius: '0px',
   height: {
       xs: '40px',
      
   },
   fontWeight: 'bold',
    marginTop: 15,
    borderRadius:"6px",
   width:'fit-content',
   textTransform:'capitalize',
   fontSize:'15px',
   color:palette?.mode==="dark" ?"#fff":"#333"
}}
onClick={()=>setOpen(false)}
 >Cancel</Button>
 
  
 
 
 </Stack>    </>
    );
}