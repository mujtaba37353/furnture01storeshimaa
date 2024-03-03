import { Box, ButtonBase, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const [_, { language: lang }] = useTranslation()
  console.log(lang)
  const styles = {
    textColor: '#5B0888',
    btn: {
      BtnBgcolor: '#5B0888',
      Btncolor: 'white',
    },
  }
  return (
    <Box
      minHeight={'100vh'}
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {/* 404 */}
        <Typography
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 'bold',
            color: styles.textColor ? styles.textColor : 'gray',
          }}
        >
          404
        </Typography>

        {/* Page Not Found */}
        <Typography
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            color: styles.textColor ? styles.textColor : 'gray',
            textalign: 'center',
            my: '1rem',
          }}
        >
          {lang === 'en' ? 'Page Not Found !' : '! الصفحة غير موجودة'}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.6rem', sm: '0.8rem' },
            color: styles.textColor ? styles.textColor : 'gray',
            textalign: 'center',
            wordBreak: 'break-word',
          }}
        >
          {lang === 'en'
            ? 'Sorry, the page you are looking for does not exist,plaese go back to home page'
            : 'عذراً، الصفحة التي تبحث عنها غير موجودة، الرجاء العودة للصفحة الرئيسية'}
        </Typography>

        <Box>
          <ButtonBase
            onClick={() => navigate('/')}
            sx={{
              borderRadius: '2rem',
              padding: '10px 30px',
              backgroundColor: 'gray',
              marginTop: '2rem',
              bgcolor: styles.btn.BtnBgcolor
                ? `${styles.btn.BtnBgcolor} !important`
                : 'gray !important',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.5rem' },
                fontWeight: 'bold',
                color: styles.btn.Btncolor ? styles.btn.Btncolor : 'white',
                textalign: 'center',
              }}
            >
              {lang === 'en' ? 'Go Home' : 'العودة للرئيسية'}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  )
}

export default NotFoundPage
