import { Box, Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useLazyGetSpecificPrivacyQuery } from '../../../redux/apis/privacyApi';
import { colors } from '../../../constants/colors'
const textColor = colors.darkColor

export const NoImage = () => {
  const [getPrivacy] = useLazyGetSpecificPrivacyQuery()

  const { policyType } = useParams()
  const [section, setSection] = useState({
    data: {},
    loading: true,
    error: '',
  })
  useEffect(() => {
    getPrivacy(policyType)
      .unwrap()
      .then((res) => {
        setSection({
          data: res.data[0],
          loading: false,
          error: '',
        })
      })
      .catch((err) => {
        setSection({
          data: {},
          loading: false,
          error: err.data[`error_${language}`],
        })
      })
  }, [policyType])
  const {
    i18n: { language },
  } = useTranslation()
  if (section.loading) {
    return (
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'50vh'}
      >
        <Box className="loader" />
      </Stack>
    )
  } else if (!section.loading && section.error) {
    return (
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'50vh'}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'red',
          }}
        >
          {section.error}
        </Typography>
      </Stack>
    )
  }

  return (
    <Container sx={{ my: 5,minHeight:"100vh",minWidth:{xs:"95%",md:'90%'} }}
      p={3}
      
    >
      <Box
        component={'h1'}
        sx={{
          direction: language === 'en' ? 'ltr' : 'rtl',
          textAlign: language === 'en' ? 'left' : 'right',
          '& p': { textAlign: language === 'en' ? 'left' : 'right' },
          '& ul': { textAlign: language === 'en' ? 'left' : 'right' },
          '& ol': { textAlign: language === 'en' ? 'left' : 'right' },
          color: textColor ? textColor : undefined,
        }}
        dangerouslySetInnerHTML={{
          __html: section.data[`title_${language}`],
        }}
      />
      <Box
        sx={{
          lineHeight: 2,
          fontSize: 15,
          color: textColor ? textColor : undefined,
          direction: language === 'en' ? 'ltr' : 'rtl',
          textAlign: language === 'en' ? 'left' : 'right',
          '& p': { textAlign: language === 'en' ? 'left' : 'right' },
          '& ul': { textAlign: language === 'en' ? 'left' : 'right' },
          '& ol': { textAlign: language === 'en' ? 'left' : 'right' },
        }}
        dangerouslySetInnerHTML={{
          __html: section.data[`description_${language}`],
        }}
      />
    </Container>
  )
}
