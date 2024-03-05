import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import OrderStatus  from '../../Components/shippingv2/orderStatus/OrderStatus';
import { useTranslation } from 'react-i18next';
import { DialogContent, Stack } from '@mui/material';

const emails = ['username@gmail.com', 'user02@gmail.com'];

function SimpleDialog(props) {
  const { onClose, selectedValue, open,order } = props;
  console.log(order,'dsaaorede')
  const [,{language:lng}]=useTranslation()
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{
    }}>
      <DialogTitle>Order Status</DialogTitle>
        <DialogContent>

<Stack>
  
<Typography sx={{
  color:'#333',
  textAlign:'center',
  fontWeight:'bold',
  textTransform:'uppercase',
}}>
 
                                  
                             
   <OrderStatus status={order?.data?.status.replace(' ','')} lng={lng}/>
 </Typography>
</Stack>
        </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function TrackOrder({
    order,
    setOpen,
    open
    
}) {


  console.log(order)
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
  
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        order={order}
      />
      
      
      
      </>
   );
}