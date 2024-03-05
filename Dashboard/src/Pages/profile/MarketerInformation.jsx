import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Typography,
  Box,
  Stack
} from '@mui/material'
import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useGetAllProductsQuery } from '../../api/product.api'

function Point ({ point, lang }) {
  const [open, setOpen] = useState(false)
  const { data: products } = useGetAllProductsQuery('?limit=1000')

  const getProductNameById = id => {
    const product = products?.data?.find(item => item?._id === id)
    return { title_en: product?.title_en, title_ar: product?.title_ar }
  }
  const smallTableTitles = [
    { title_en: 'Product', title_ar: 'المنتج' },
    { title_en: 'Quantity', title_ar: 'الكمية' },
    { title_en: 'Total Price', title_ar: 'السعر الكلي' }
  ]
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align={lang === 'en' ? 'left' : 'right'}>
          {point?.order?.name}
        </TableCell>
        <TableCell align={lang === 'en' ? 'left' : 'right'}>
          {point?.order?.phone}
        </TableCell>
        <TableCell align={lang === 'en' ? 'left' : 'right'}>
          {point?.order?.email}
        </TableCell>
        <TableCell align={lang === 'en' ? 'left' : 'right'}>
          {point?.commission}
        </TableCell>
      </TableRow>

      <TableRow>
        {/* cashItems */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant='h6'
                gutterBottom
                component='div'
                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                align={lang === 'en' ? 'left' : 'right'}
              >
                {lang === 'en' ? 'cashItems' : 'المنتجات النقدية'}
              </Typography>
              <Table size='medium' aria-label='purchases' width='100%'>
                {/* product head */}
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {smallTableTitles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={lang === 'en' ? 'left' : 'right'}
                      >
                        {title[`title_${lang}`]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {point?.order?.cashItems?.items?.map(item => (
                    <TableRow key={item?.id}>
                      <TableCell></TableCell>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {getProductNameById(item?.product)[`title_${lang}`]}
                      </TableCell>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {item?.quantity}
                      </TableCell>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {item?.totalPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        {/* onlineItems */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant='h6'
                gutterBottom
                component='div'
                align={lang === 'en' ? 'left' : 'right'}
                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              >
                {lang === 'en' ? 'onlineItems' : 'المنتجات الالكترونية'}
              </Typography>
              <Table size='medium' aria-label='purchases' width='100%'>
                {/* product head */}
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {smallTableTitles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={lang === 'en' ? 'left' : 'right'}
                      >
                        {title[`title_${lang}`]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {point?.order?.onlineItems?.items?.map(item => (
                    <TableRow key={item?.id}>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {getProductNameById(item?.product)[`title_${lang}`]}
                      </TableCell>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {item?.quantity}
                      </TableCell>
                      <TableCell align={lang === 'en' ? 'left' : 'right'}>
                        {item?.totalPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const MarketerInformation = ({
  lang,
  points,
  totalCommission,
  customColors
}) => {
  const tableTitles = [
    { title_en: 'Name', title_ar: 'الاسم' },
    { title_en: 'Phone', title_ar: 'الجوال' },
    { title_en: 'Email', title_ar: 'البريد الالكتروني' },
    { title_en: 'Commission', title_ar: 'العمولة' }
  ]

  return (
    <TableContainer component={Paper} sx={{bgcolor: customColors.container}}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {tableTitles.map(title => (
              <TableCell
                key={title.title_en}
                align={lang === 'en' ? 'left' : 'right'}
              >
                {lang === 'en' ? title.title_en : title.title_ar}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {points.map((point, index) => (
            <Point key={index} point={point} lang={lang} />
          ))}
        </TableBody>
      </Table>
      <Stack
        direction={'row'}
        justifyContent={'flex-end'}
        gap={2}
        alignItems={'center'}
        p={4}
      >
        <Typography variant='p' sx={{ fontWeight: 'bold', color: '#959595' }}>
          {lang === 'en' ? 'Total Money' : 'اجمالي المبلغ'}
        </Typography>
        <Typography
          variant='p'
          sx={{
            fontWeight: 'bold',
            bgcolor: customColors.inputField,
            p: 1,
            borderRadius: '6px'
          }}
        >
          {totalCommission} {lang === 'en' ? 'Rial' : 'ريال'}
        </Typography>
      </Stack>
    </TableContainer>
  )
}

export default MarketerInformation
