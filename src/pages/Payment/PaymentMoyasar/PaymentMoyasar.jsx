import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoyaserBaseUrl } from '../../../constants/baseUrl'
import { useGetAllCartsQuery } from '../../../redux/apis/cartApi'
import applePayIMG from '../../../assets/payment/applePay.png'
import creditCardIMG from '../../../assets/payment/creditCard.png'
import stcPayIMG from '../../../assets/payment/stcPay.svg'

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        px: {
          xs: 3,
          sm: 5,
          md: 10,
          lg: 20,
        },

        // px: {
        //   xs: 1,
        //   md: 5,
        //   lg: 10,
        // },
        // py: 5,
        // minHeight: '50vh',
      }}
    >
      {children}
    </Box>
  )
}

// const publishable_api_key = 'pk_live_vEaZcCbsPv6rJtdgTdVqWVX5RBM1TYuGuVXsxFFm'
const publishable_api_key= 'pk_test_f9ReoAys1F41VUdEvfPQM9d3dRN1qV124habH74S'
const Creditcard = ({ amount, callback_url, description, metadata }) => {
  useEffect(() => {
    // @ts-ignore
    Moyasar.init({
      element: '.creditcard',
      amount,
      currency: 'SAR',
      description,
      metadata,
      publishable_api_key,
      callback_url,
      methods: ['creditcard'],
    })
  }, [amount])
  return <div className="creditcard"></div>
}
const Stcpay = ({ amount, callback_url, description, metadata }) => {
  useEffect(() => {
    // @ts-ignore
    Moyasar.init({
      element: '.stcpay',
      amount,
      currency: 'SAR',
      description,
      publishable_api_key,
      callback_url,
      metadata,
      methods: ['stcpay'],
    })
  }, [amount])
  return <div className="stcpay"></div>
}

const Applepay = ({ amount, callback_url, description, metadata }) => {
  useEffect(() => {
    // @ts-ignore
    Moyasar.init({
      element: '.applepay',
      amount,
      currency: 'SAR',
      description,
      publishable_api_key,
      callback_url,
      methods: ['applepay'],
      metadata,
      apple_pay: {
        country: 'SA',
        label: description,
        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
      },
    })
  }, [amount])
  return <div className="applepay"></div>
}

function PaymentMoyasar() {
  const [_, { language }] = useTranslation()

  const [type, setType] = useState('creditcard')

  const { data, isLoading, isSuccess } = useGetAllCartsQuery()

  const couponData = JSON.parse(localStorage.getItem('couponData'))

  if (isLoading) {
    return <Box sx={{ minHeight: '50vh' }}>loading ......</Box>
  }

  if (isSuccess) {
    const metadata = {
      cart_id: data._id,
      user_id: data?.data?.user?._id,
      total_quantity: data?.data?.onlineItems?.quantity,
    }
    const callback_url = `${MoyaserBaseUrl}/thankYou?cart_id=${data._id}`
    return (
      <Layout>
        <Box
          className="parent"
          sx={{ width: { xs: '95%', sm: '80%', md: '50%' }, m: 'auto' }}
          // style={{ marginTop: '20px' }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#727272',
              p: '20px',
              borderBottom: '3px solid #727272',
              width: 'fit-content',
              fontSize: '28px',
              fontWeight: 'bold',
              mb: '20px',
              mx: 'auto',
            }}
          >
            {language == 'en' ? 'Payment Method' : 'طريقة الدفع'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              background: 'white',
              borderRadius: '25px',
              padding: '12px 15px',
              border: '1px solid #e0e0e0',
            }}
          >
            <img
              style={{
                width: '50%',
                height: '120px',
                objectFit:{ xs:'fill',lg:'cover'},
              }}
              src={creditCardIMG}
            />
            <Button
              variant="contained"
              onClick={() => setType('creditcard')}
              sx={{
                maxWidth: '120px',
                fontSize: '14px',
                bgcolor: '#727272 !important',
              }}
            >
              CREDITCARD
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              background: 'white',
              borderRadius: '25px',
              padding: '12px 15px',
              border: '1px solid #e0e0e0',
              my: '20px',
            }}
          >
            <img
              style={{ minWidth: '120px', height: '50px' }}
              src={stcPayIMG}
            />
            <Button
              variant="contained"
              onClick={() => setType('stcpay')}
              sx={{
                minWidth: '120px',
                fontSize: '13px',
                bgcolor: '#727272 !important',
              }}
            >
              STCPAY
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              background: 'white',
              borderRadius: '25px',
              padding: '12px 15px',
              border: '1px solid #e0e0e0',
            }}
          >
            <img
              style={{ minWidth: '120px', height: '50px' }}
              src={applePayIMG}
            />
            <Button
              variant="contained"
              onClick={() => setType('applepay')}
              sx={{
                minWidth: '120px',
                fontSize: '14px',
                bgcolor: '#727272 !important',
              }}
            >
              APPLPAY
            </Button>
          </Box>
        </Box>

        <Box sx={{ py: 5 }}>
          {type === 'creditcard' && (
            <Creditcard
              amount={(data?.data?.onlineItems?.totalPrice || 0) * 100}
              callback_url={callback_url}
              description={` pay ${
                ((data?.data?.onlineItems?.totalPrice || 0) * 100) / 100
              }`}
              metadata={metadata}
            />
          )}
          {type === 'stcpay' && (
            <Stcpay
              amount={(data?.data?.onlineItems?.totalPrice || 0) * 100}
              callback_url={callback_url}
              description={` pay ${
                ((data?.data?.onlineItems?.totalPrice || 0) * 100) / 100
              }`}
              metadata={metadata}
            />
          )}
          {type === 'applepay' && (
            <Applepay
              amount={(data?.data?.onlineItems?.totalPrice || 0) * 100}
              callback_url={callback_url}
              description={` pay ${
                ((data?.data?.onlineItems?.totalPrice || 0) * 100) / 100
              }`}
              metadata={metadata}
            />
          )}
        </Box>
      </Layout>
    )
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40vh',
      }}
      className=""
    >
      <p style={{ color: 'red' }}>Something went wrong!!</p>
    </Stack>
  )
}

export default PaymentMoyasar
