import { Stack, Typography } from "@mui/material"
const salahCustomization= {
    initiated : {en:"initiated",er:"بدأ الطلب"},
    created : {en:"created",ar:"تم الطلب"},
    pending : { en:"pending",ar:"طلب معلق"},
    awaiting_pickup : {en:"awaiting pick up",ar:"في انتظار  اخذ الطلب"},
    currently_shipping :{en:"currently shipping",ar:"في الطريق للتوصيل"},
    shipment_on_hold: {en:"shipment on hold",ar:"الشحن معلق"},
    delivered :{en: "delivered",ar:"تم التوصيل"},
    canceled :{en: "canceled",ar:"  الطلب مرفوض"   },
    returned : {en:"returned",ar:"طلب مرتجع"},
  }
  
export const OrderDetails=({Icon,lng,status})=>{
    return(<Stack sx={{
      flexDirection:'row-reverse',
      width: "100px",
      justifyContent:'space-around',
      width: 'fit-content',
      'align-items': 'center',
      ' border-radius':'10px',
     marginLeft:'unset',
     margin:'auto'
    }}>
      <Stack component={'img'}
      sx={
        {
          width:'30px',
         }
      }
      src={Icon}
      />
      <Typography sx={{
        margin:'0px 10px',
        fontWeight:'bold',
        textTransform:'capitalize',
      }}>
         
      {
        salahCustomization[status][lng]
      }
      </Typography>
      </Stack>)
  }