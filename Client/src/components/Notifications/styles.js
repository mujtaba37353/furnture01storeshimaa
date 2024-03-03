export const MenuStyles = ({ lng }) => ({
  Menu: {
  
    ".MuiMenu-paper":{
      height:' 478px',
      width:' 292px',
      left: '100px',
       textAlign:'center',

    }
  },
  menuTitle: {
    textAlign: lng === 'ar' ? 'right' : 'left',
    fontWeight: 'bold',
    fontSize: '15px',
    padding: '15px',
  },
 
})
