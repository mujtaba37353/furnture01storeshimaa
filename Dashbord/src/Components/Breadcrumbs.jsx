import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
const Breadcrumbs = ({ page_en, page_ar }) => {
  const [, { language: lng }] = useTranslation()
  const nav = useNavigate()
  return (
    <Box>
      <Typography variant='h4'>{lng === 'en' ? page_en : page_ar}</Typography>

      <Typography mt={1} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component={'span'}
          sx={{
            ':hover': {
              textDecoration: 'underline',
              cursor: 'pointer'
            }
          }}
          onClick={() => nav('/')}
        >
          {lng === 'en' ? 'Home' : 'الرئيسية'}
        </Box>
        {lng === 'en' ? (
          <NavigateNextIcon fontSize='small' />
        ) : (
          <NavigateBeforeIcon fontSize='small' />
        )}
        <Box component={'span'} sx={{ color: '#00e3d2' }}>
          {lng === 'en' ? page_en : page_ar}
        </Box>
      </Typography>
    </Box>
  )
}

export default Breadcrumbs
