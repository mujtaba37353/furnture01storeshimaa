import React from 'react'
 import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
 
 
export default function CustomerProduct({
    customerInferomation,
    lng
}) {

  return (
    <TableContainer  sx={{
        marginTop:'20px',
         border:"1px solid #eee"
    }}>
    <Table sx={{ minWidth: 650 }} aria-label="caption table">
      <caption>

        {
        lng==="en"?`
        This is An Customer Inferomation which related To this Product
        `:`
        بيانات المستخدم القائم بشراء هذه المنتجات
        `
        }
      </caption>
      <TableHead>
        <TableRow>
          <TableCell sx={{
            textAlign: 'center !important'
          }} >{lng==="en"?"name":"الاسم"}</TableCell>
          <TableCell sx={{
            textAlign: 'center !important'
          }}  align="right">{lng==="en"?"address":"العنوان"}</TableCell>
          <TableCell sx={{
            textAlign: 'center !important'
          }}  align="right">{lng==="en"?"area":"المنطقه"}</TableCell>
          <TableCell  sx={{
            textAlign: 'center !important'
          }} align="right">{lng==="en"?"email":"الايميل"}</TableCell>
          <TableCell  sx={{
            textAlign: 'center !important'
          }} align="right">{lng==="en"?"phone":"رقم الهاتف"}</TableCell>
          <TableCell  sx={{
            textAlign: 'center !important'
          }} align="right">{lng==="en"?"payment Type":"نوع الدفع"}</TableCell>
          <TableCell  sx={{
            textAlign: 'center !important'
          }} align="right">{lng==="en"?"total Quantity":" الكميه"}</TableCell>
          <TableCell  sx={{
            textAlign: 'center !important'
          }} align="right">{lng==="en"?"total price":" السعر الاجمالي"}</TableCell>
     
        </TableRow>
      </TableHead>
      <TableBody>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.name}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.address}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.area}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.email}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.phone}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.paymentType}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.totalQuantity}
        </TableCell>
      <TableCell sx={{
        textAlign:'center'
      }} align="right">
        {customerInferomation?.totalPrice}
        </TableCell>

      </TableBody>
    </Table>
  </TableContainer>  )
}
