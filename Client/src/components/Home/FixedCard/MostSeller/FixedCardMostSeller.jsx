import React from 'react'
import { useGetMostSellingProductsQuery } from '../../../../redux/apis/ProductApis'
import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Card3 from '../../../Cards/Horizontal Rectangle/StrokeCard3'
import { FixedColors } from './FixedCardColors.js'
import { useTheme } from '@emotion/react'
import Slider from './../../Newest/Scrolling2/slider'
import Card8 from '../../../Cards/Horizontal Rectangle/strockCustomCard7/index.jsx'

const ErrorSection = ({ isError, error }) => {
  const [, { language: lang }] = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography
        fontSize={'1.5rem'}
        my={10}
        textAlign={'center'}
        color="error"
      >
        {isError
          ? error?.data && error?.data[`error_${lang}`]
          : error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}

const FixedCardMostSeller = () => {
  const { data, isSuccess, isError, error } = useGetMostSellingProductsQuery()
  const [, { language: lang }] = useTranslation()
  const MostData = data?.data?.slice(0, 6)
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box my={10}>
      {/* {isError && error && <ErrorSection error={error} isError={isError} />} */}
      {isSuccess && !isError && data?.data?.length > 0 ? (
        <>
          <Box
            sx={{
              textAlign: 'center',
              mb: 1,
              marginTop: '-40px',
              marginBottom: { xs: '0px', sm: '25px', lg: '40px' },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2.3rem', sm: '2.5rem', lg: '4rem' },
                fontWeight: 'bold',
                color: FixedColors.titleColor || 'black',
              }}
            >
              {lang === 'en' ? 'Most Sellery' : 'الاكثر مبيعا'}
            </Typography>
          </Box>

          {!phoneScreen ? (
            <Stack
              direction={{ xs: 'row', md: 'row' }}
              width={'85%'}
              mx={'auto'}
              justifyContent={{ xs: 'center', md: 'space-around' }}
              alignItems={{ xs: 'center', md: 'center' }}
              gap={3}
            >
              {MostData?.slice(0, 3).map((item, index) => (
                <Box
                  className={'card_category cat_w'}
                  key={index}
                  sx={{
                    '& .ssss': {
                      height: {
                        xs: '300px',
                        sm: '350px',
                        md: '450px',
                        xl: '536px',
                      },

                      ' .swiper-slide.swiper-slide-visible.swiper-slide-active #cardStyle':
                        {
                          height: {
                            xs: '300px !important',
                            sm: '350px !important',
                            md: '450px !important',
                            xl: '536px !important',
                          },
                          '& .card_category #cardStyle': {
                            width: 'unset !important  ',
                          },
                        },
                    },
                  }}
                >
                  <Card8 data={item} />
                </Box>
              ))}
            </Stack>
          ) : (
            <Slider data={MostData} />
          )}
        </>
      ) : null}
    </Box>
  )
}

export default FixedCardMostSeller
