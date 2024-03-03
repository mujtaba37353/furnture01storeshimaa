import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { use } from 'i18next'
import { useMoyasarWebhookPaymentMutation } from '../../redux/apis/webhookApi'
import { ThanksStyle } from './ThanksStyle'

const ThanksPage = () => {
  const param = new URLSearchParams(useLocation().search)
  const status = param.get('status')
  const message = param.get('message')

  const [_, { language }] = useTranslation()
  const navigate = useNavigate()

  const [webhookPayment, { isLoading }] = useMoyasarWebhookPaymentMutation()

  useEffect(() => {
    if (status === 'paid' && message === 'APPROVED') {
      webhookPayment(param.get('id'))
        .then((res) => {
          console.log('what should be the result : ', res)
          
          localStorage.removeItem("couponData")
        })
        .catch((err) => {
          console.log('what should be the result : ', err)
        })
    }
  }, [param.get('id')])
  return (
    <Stack
      height={'100vh'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <Box>
          {status === 'paid' || status === null ? (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 'bold',
                  color: ThanksStyle.color?.titleColor || '#d55252',
                  textAlign: 'center',
                  fontSize: {
                    xs: '50px',
                    sm: '60px',
                    md: '70px',
                    lg: '80px',
                    xl: '100px',
                  },
                  my: 2,
                }}
              >
                {language === 'en' ? 'THANKS' : 'شكراً'}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  color: ThanksStyle.color?.titleColor || '#d55252',
                  textAlign: 'center',
                  fontSize: {
                    xs: '40px',
                    sm: '50px',
                    md: '60px',
                    lg: '70px',
                    xl: '80px',
                  },
                }}
              >
                {language === 'en' ? 'FOR THE ORDER' : 'علي الطلب'}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h1"
              sx={{
                fontWeight: 'bold',
                color: ThanksStyle.color?.titleColor || '#d55252',
                textAlign: 'center',
                fontSize: {
                  xs: '40px',
                  sm: '50px',
                  md: '60px',
                  lg: '70px',
                  xl: '80px',
                },
              }}
            >
              {language === 'en'
                ? 'SORRY YOUR PAYMENT FAILED'
                : 'عذراً فشلت عملية الدفع'}
            </Typography>
          )}

          <Stack justifyContent="center" gap="20px" mt="40px">
            <Button
              onClick={() => window.location.replace('/')}
              sx={{
                bgcolor:
                  `${ThanksStyle.color?.Btn?.bgColor}!important` ||
                  'black !important',
                color: ThanksStyle.color?.Btn?.textColor || '#fff',
                textTransform: 'capitalize',
                padding: '12px 20px',
                fontSize: '20px',
                borderRadius: '5px',
              }}
            >
              {language === 'en' ? 'Go To Home Page' : 'إذهب الي الرئيسية'}
            </Button>
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

export default ThanksPage
