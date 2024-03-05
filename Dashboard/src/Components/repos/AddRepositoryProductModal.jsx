import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Autocomplete from '@mui/material/Autocomplete'
import { FormControl, Stack, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@emotion/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import { useAddProductToRepoMutation } from '../../api/repos.api'
import { useSelector } from 'react-redux'
const AddRepositoryProductModal = ({ open, setOpen, repo }) => {
  const { colors, customColors } = useTheme()
  const {
    i18n: { language: lang }
  } = useTranslation()

  const [addProductToRepo] = useAddProductToRepoMutation()
  // formik
  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    setFieldValue,
    resetForm,
    handleBlur
  } = useFormik({
    initialValues: {
      quantity: 0,
      selectedProduct: null
    },
    validationSchema: Yup.object({
      quantity: Yup.number().required(lang === 'en' ? 'Required' : 'مطلوب'),
      selectedProduct: Yup.object().required(
        lang === 'en' ? 'Required' : 'مطلوب'
      )
    }),
    onSubmit: values => {
      addProductToRepo({
        body: {
          quantity: values.quantity,
          productId: values.selectedProduct._id
        },
        id: repo._id
      })
        .unwrap()
        .then(() => {
          handleClose()
          resetForm()
          toast.success(
            lang === 'en' ? 'Updated Successfully' : 'تم الاضافه بنجاح'
          )
        })
        .catch(error => {
          const message =
            lang === 'en' ? error?.data?.error_en : error?.data?.error_ar
          toast.error(message)
        })
    }
  })
  // const { products, isLoading } = useFetchProducts(`?limit=1000`);
  const { repoProducts } = useSelector(state => state)
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }
  console.log('check here for repoProducts please',repoProducts)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '720px !important',
          py: '40px',
          px: '30px',
          borderRadius: '15px'
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '100%', gap: 3 }}>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: '4px' }}>
              {lang === 'en' ? 'Quantity' : 'الكمية'}
            </Typography>
            <TextField
              name='quantity'
              type='number'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.quantity}
              helperText={
                touched.quantity && errors.quantity ? errors.quantity : ''
              }
              error={touched.quantity && errors.quantity}
              variant='outlined'
              InputProps={{
                inputProps: {
                  min: 1
                }
              }}
              sx={{
                '&:hover': {
                  fieldset: { borderColor: customColors.inputField }
                },
                fieldset: { borderColor: customColors.inputField }
              }}
            />
          </Stack>
          <Stack>
            <Autocomplete
              //   multiple
              id='selectedProduct'
              options={repoProducts.items}
              getOptionLabel={option => option[`title_${lang}`]}
              value={values.selectedProduct}
              onChange={(e, value) => setFieldValue('selectedProduct', value)}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  sx={{ color: 'black' }}
                  placeholder={lang === 'en' ? 'select product' : 'اختر منتج'}
                  error={
                    touched.selectedProduct && Boolean(errors.selectedProduct)
                  }
                  helperText={touched.selectedProduct && errors.selectedProduct}
                />
              )}
            />
          </Stack>
        </FormControl>

        {/* submit and cancel button of dialog */}
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '20px',
            gap: 2
          }}
        >
          <Button
            variant='contained'
            type='submit'
            sx={{
              bgcolor: colors.main,
              textTransform: 'capitalize',
              '&:hover': { bgcolor: customColors.main }
            }}
            // disabled={dataCoupon ? updateCouponLoading : createCouponLoading}
          >
            {lang === 'en' ? 'Save' : 'حفظ التعديلات'}
          </Button>
          <Button
            onClick={handleClose}
            variant='outlined'
            sx={{
              borderColor: colors.main,
              color: colors.main,
              textTransform: 'capitalize',
              '&:hover': { borderColor: customColors.main }
            }}
          >
            {lang === 'en' ? 'cancel' : 'الغاء'}
          </Button>
        </Stack>
      </form>
    </Dialog>
  )
}

export default AddRepositoryProductModal
