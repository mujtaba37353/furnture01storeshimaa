import { Paper, Stack, Typography, Button, Box } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDeleteOfferMutation } from '../../api/offers.api'
import moment from 'moment/moment'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { allowed } from '../../helper/roles'
const OfferCard = ({ item, handleSelectOffer }) => {
  const { role } = useSelector(state => state.user)
  const { customColors, colors } = useTheme()
  const [_, { language }] = useTranslation()
  const [deleteOffer] = useDeleteOfferMutation()
  const handleRemove = () => {
    deleteOffer(item._id)
      .unwrap()
      .then(res => {
        toast.success(res[`success_${language}`])
      })
      .catch(err => {
        toast.success(err.data[`success_${language}`])
      })
  }
  let arabicKeys = {
    allProducts: 'الكل',
    products: 'المنتجات',
    categories: 'الأقسام',
    subcategories: 'الأقسام الفرعية'
  }
  let arabicBanner = {
    vertical: 'رأسي',
    horizontal: 'أقفي'
  }

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: item?.active ? customColors.card : customColors.cardNotActive,
        p: 2,
        borderRadius: 5,
        gap: 5,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: '236px',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Stack sx={{ width: '100%', gap: 1 }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          {item.title}
        </Typography>

        {/* email */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ color: colors.grey }}>
            {language === 'en' ? 'Discount on : ' : 'خصم علي : '}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {language === 'en'
              ? item.discountDepartment.key
              : arabicKeys[item.discountDepartment.key]}
          </Typography>
        </Stack>
        {/* phone */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ color: colors.grey }}>
            {language === 'en' ? 'Values offers : ' : 'قيمة العرض : '}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {`${item.percentage}%`}
          </Typography>
        </Stack>

        {/* date of join */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ color: colors.grey }}>
            {language === 'en' ? 'Start date : ' : 'تاريخ البدء : '}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {moment(item.startDate).format('YYYY-MM-DD')}
          </Typography>
        </Stack>

        {/* role */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ color: colors.grey }}>
            {language === 'en' ? 'End date : ' : 'تاريخ الإنتهاء : '}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {moment(item.endDate).format('YYYY-MM-DD')}
          </Typography>
        </Stack>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ color: colors.grey }}>
            {language === 'en' ? 'Banner : ' : 'بانر : '}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {language === 'en'
              ? item.typeOfBanner
              : arabicBanner[item.typeOfBanner]}
          </Typography>
        </Stack>

        {/* delet button */}
        {allowed({ page: 'offers', role }) ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Button
              variant='contained'
              sx={{
                bgcolor: '#e35959 !important',
                textTransform: 'capitalize',
                color: 'white',
                width: 0.2
              }}
              onClick={handleRemove}
            >
              {language === 'en' ? 'delete' : 'حذف'}
            </Button>
            <Button
              variant='contained'
              sx={{
                bgcolor: 'transparent !important',
                textTransform: 'capitalize',
                color: '#00E3D2',
                border: 1,
                borderColor: '#00E3D2',
                width: 0.2
              }}
              onClick={() => handleSelectOffer(item)}
            >
              {language === 'en' ? 'Edit' : 'تعديل'}
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
    </Paper>
  )
}

export default OfferCard
