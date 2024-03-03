import { useTheme } from '@emotion/react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import { ListItemAvatar } from '@mui/material';
export const OrderStatues = ({item,text,number=0})=>{
  const { colors, customColors } = useTheme();

//   const IconComponent = [DangerousOutlinedIcon,CheckCircleOutlineIcon]
//   const SelectedIconComponent = IconComponent[number];

  return( <ListItemAvatar sx={{
    display:'flex',
    alignItems:'center',
    background: '#02857b3b',
    padding: '4px',
    borderRadius: '10px',
    fontSize: '12px',
    justifyContent: 'space-between',
  }}>
{text}
 {
    number ===1?
    <CheckCircleOutlineIcon sx={{
        marginLeft:'6px',
        width:'20px',
        height:'20px'
      }} color='#333' />
    :<DangerousOutlinedIcon sx={{
        marginLeft:'6px',
        width:'20px',
        height:'20px'
      }} color='error' />

 }   
  </ListItemAvatar>)
}