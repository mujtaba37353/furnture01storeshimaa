// export default SelectPayment
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MoyasarLogo from '../../../assets/payment/moyasar.png'
import TabbyLogo from '../../../assets/payment/tabby.png'
import { useGetAllCartsQuery } from '../../../redux/apis/cartApi'
import { useLazyCheckoutTabbyQuery } from '../../../redux/apis/ordersApi'

function SelectPayment() {
  const [selectedPayment, setSelectedPayment] = useState('')
  const navigate = useNavigate()
  const [checkoutTabby] = useLazyCheckoutTabbyQuery()
  const { data, isLoading, isSuccess } = useGetAllCartsQuery()
  const [, { language: lang }] = useTranslation()
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.tabby.ai/tabby-promo.js';
    script.async = true;
    if (isSuccess) {
      script.onload = () => {
        // Once the script is loaded, initialize TabbyPromo
        new TabbyPromo({
          selector: '#TabbyPromo',
          currency: 'SAR',
          price: `${data?.data?.onlineItems?.totalPrice}`, // Use the state variable for price
          installmentsCount: 4,
          lang: lang === 'en' ? 'en' : 'ar',
          source: 'product',
          publicKey: 'pk_test_b7684c78-7362-4500-928d-aa995c57fdfc',
          merchantCode: 'Aldhubaibi',
        })
      };
  
      // Append the script to the document body
      document.body.appendChild(script);
  
      // Clean up the script on unmount
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [data])



  const handleChange = (event) => {
    setSelectedPayment(event.target.value)
  }

  const handleNextPayment = () => {
    if (selectedPayment === 'moyasar') {
      navigate('/payment-moyasar')
    } else if (selectedPayment === 'tabby') {
      checkoutTabby()
        .unwrap()
        .then((data) => {
          window.location.replace(data.data.url)
        })
        .catch((err) => {
          console.error('Error during Tabby checkout:', err)
        })
    }
  }

  const renderPaymentOption = (value, logo, labelEn, labelAr) => (
    <Box
      key={value}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '20px',
        background: 'white',
        borderRadius: '5px',
        padding: '12px 10px',
        border: '2px solid #727272',
        my: '20px',
        flexDirection: 'column',
      }}
    >
      <FormControlLabel
        value={value}
        sx={{
          mx: 0,
        }}
        control={
          <Radio
            sx={{
              mx: 0,
            }}
          />
        }
        label={
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <img
                src={logo}
                alt={`${lang === 'em' ? labelEn : labelAr} Logo`}
                style={{ width: '100px', height: '40px', marginRight: 10 }}
              />
              <Typography
                style={{
                  fontSize: {
                    md: '20px',
                    xs: '14px',
                  },
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                {lang === 'en' ? labelEn : labelAr}
              </Typography>
            </div>
          </>
        }
      />
      <Box sx={{ width: '90%', direction: lang === 'en' ? 'ltr' : 'rtl', mx: {xs: "15px"} }}>
        {value === 'tabby' ? (
          <div id="TabbyPromo"></div>
        ) : (
          <Typography variant="p" sx={{ fontSize: '20px' }}>
            {isSuccess &&
              `${lang === 'en' ? 'total' : 'الاجمالي'} : SAR ${
                data?.data?.onlineItems?.totalPrice
              }`}
          </Typography>
        )}
      </Box>
    </Box>
  )

  return (
    <Box
      className="parent"
      sx={{
        width: { xs: '95%', sm: '80%', md: '50%', lg: '40%' },
        m: 'auto',
        my: '30px',
        direction: lang === 'en' ? 'ltr' : 'rtl',
      }}
    >
      {/* Select Payment Title */}
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
        {lang === 'en' ? 'Select Payment' : 'اختر طريقة الدفع'}
      </Typography>
      {/* Payment Options */}
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={selectedPayment}
        onChange={handleChange}
      >
        {renderPaymentOption(
          'moyasar',
          MoyasarLogo,
          'Payment By Moyasar',
          'الدفع عن طريق ميسر'
        )}
        {renderPaymentOption(
          'tabby',
          TabbyLogo,
          'Payment By Tabby',
          'الدفع عن طريق تابي'
        )}
      </RadioGroup>

      {/* Next Button */}
      <Box
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}
      >
        <Button
          variant="contained"
          sx={{
            maxWidth: '120px',
            fontSize: '14px',
            padding: '12px 32px',
            borderRadius: 2,
            bgcolor: '#727272 !important',
          }}
          onClick={handleNextPayment}
          disabled={!selectedPayment}
        >
          {lang === 'en' ? 'Next' : 'التالي'}
        </Button>
      </Box>
    </Box>
  )
}

export default SelectPayment
