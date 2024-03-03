import React from 'react'
import { Box, Button, ButtonBase, InputBase, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Input } from '@mui/joy'
import * as yup from 'yup'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { VerificationColors } from './VerificationColors'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
const VerifiedCode = (props) => {
  const navigate = useNavigate()
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  }
  const [_, { language: lang }] = useTranslation()
  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: yup.object({
      code: yup
        .number()
        .required(lang === 'en' ? 'Required' : 'مطلوب')
        .typeError(lang === 'en' ? 'Must be a number' : 'يجب ان يكون رقم'),
    }),

    onSubmit: (values) => {
      props.handelerCode(values.code, props?.userPhone || '')
    },
  })
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Modal
        sx={{
          direction: lang === 'en' ? 'ltr' : 'rtl',
        }}
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{
            position: 'absolute',
            top: '4%',
            right: lang==="en"?"2%":undefined,
            left: lang==="ar"?"4%":undefined,
            pb: '10px',
            color: VerificationColors?.title || 'black',
            cursor: 'pointer',
            
          }}
          onClick={() => {
            formik.setValues({code:''})
            props.setOpenModal(false)
          }}
          >
            <HighlightOffIcon />
          </Box>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              mt: '10px',
              color: VerificationColors?.title || 'black',
            }}
          >
            {lang === 'en'
              ? 'Enter the code sent your phone'
              : 'ادخل الكود المرسل الي هاتفك'}
          </Typography>

          <Box mt={2}>
            <form onSubmit={formik.handleSubmit}>
              <Box>
                <InputBase
                  placeholder={lang === 'en' ? 'code' : 'الكود'}
                  type={'text'}
                  sx={{
                    width: '100%',
                    p: '12px 20px',
                    fontWeight: 'bold',
                    borderRadius: '0',
                    mt: '15px',
                    border: `2px solid ${VerificationColors?.borderInputColor} !important`,
                    '& > .css-17ewsm8-JoyInput-root': {
                      inputFocusedHighlight: 'black !important',
                    },
                    'input::placeholder': {
                      color: VerificationColors?.borderInputColor,
                    },
                  }}
                  name="code"
                  value={formik.values.code}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.errors.code && formik.touched.code && (
                  <Typography
                    fontWeight={'bold'}
                    fontSize={13}
                    // variant="p"
                    color="red"
                    // sx={{
                    //     fontFamily: publicFontFamily,
                    // }}
                  >
                    {formik.errors.code}
                  </Typography>
                )}
              </Box>

              <ButtonBase
                disabled={props.loading}
                type="submit"
                sx={{
                  color: VerificationColors?.Btn.titleColor || 'white',
                  width: '100%',
                  bgcolor: VerificationColors?.Btn.backgroundColor
                    ? `${VerificationColors?.Btn.backgroundColor} !important`
                    : 'black !important',
                  mt: '20px',

                  fontSize: {
                    xl: '22px',
                    lg: '20px',
                    xs: '18px',
                  },
                  padding: '15px 35px',
                  py: {
                    xl: '8px',
                    lg: '11px',
                    xs: '8px',
                  },
                  px: '35px',
                  // fontFamily: basicFont,
                }}
              >
                {props.loading ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress
                      sx={{
                        color: VerificationColors?.Btn.titleColor || 'white',
                      }}
                    />
                  </Box>
                ) : lang === 'en' ? (
                  'Confirm'
                ) : (
                  'تاكيد'
                )}
              </ButtonBase>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default VerifiedCode
