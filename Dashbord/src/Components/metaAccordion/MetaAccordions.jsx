import { useTheme } from '@emotion/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputText from '../globals/InputText'
import { useFormik } from 'formik'
import * as Yup from 'yup'
const MetaAccordions = ({ metaTitle, metaDesc, setFieldValue, isEdit }) => {
  const [open, setOpen] = useState(false)
  const { btnStyle, colors } = useTheme()
  const [_, { language }] = useTranslation()
  const formik = useFormik({
    initialValues: {
      title: '',
      description: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required(language === 'en' ? 'Required!' : 'مطلوب!'),
      description: Yup.string().required(
        language === 'en' ? 'Required!' : 'مطلوب!'
      )
    }),
    onSubmit: values => {
      setFieldValue('title_meta', values.title)
      setFieldValue('desc_meta', values.description)
      formik.resetForm()
    }
  })
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik
  useEffect(() => {
    if (isEdit) {
      setOpen(true)
    }
  }, [isEdit])

  return (
    <Box>
      <Accordion
        expanded={open}
        sx={{
          bgcolor: colors.bg_main
        }}
      >
        <AccordionSummary
          aria-controls='panel1bh-content'
          id='panel1bh-header'
          sx={{
            cursor: 'auto !important'
          }}
        >
          <Stack direction={'row'} justifyContent={'space-between'} width={1}>
            <Typography
              variant='h6'
              sx={{
                textTransform: 'capitalize',
                color: colors.text,
                fontWeight: 'bold',
                fontSize: '17px'
              }}
            >
              {language === 'en' ? 'Meta tag' : 'العلامات الوصفية'}
            </Typography>
            <Button
              sx={{ ...btnStyle, color: '#fff' }}
              onClick={() => {
                setOpen(!open)
              }}
            >
              {isEdit
                ? language === 'en'
                  ? 'Edit'
                  : 'تعديل'
                : language === 'en'
                ? 'Add'
                : 'أضف'}
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <InputText
              label={language === 'en' ? 'Title' : 'اللقب'}
              name='title'
              type={'text'}
              error={errors.title}
              value={values.title}
              touched={touched.title}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <Box my={'15px'}>
              <InputText
                label={language === 'en' ? 'Description' : 'الوصف'}
                name='description'
                type={'text'}
                error={errors.description}
                value={values.description}
                touched={touched.description}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </Box>
            <Stack direction={'row'} gap={'10px'}>
              <Button
                sx={{ ...btnStyle, color: '#fff', mt: 2, width: 1 }}
                type='button'
                onClick={handleSubmit}
              >
                {isEdit
                  ? language === 'en'
                    ? 'Edit meta'
                    : 'تعديل العلامة'
                  : language === 'en'
                  ? 'Add meta'
                  : 'إضافة علامة'}
              </Button>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box pt={'20px'}>
        {metaTitle && metaDesc ? (
          <Box
            border={1}
            borderColor={'divider'}
            py={3}
            px={2}
            position={'relative'}
          >
            <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
              <Typography fontWeight={'bold'}>
                {language === 'en' ? 'Title: ' : 'العنوان: '}
              </Typography>
              <Typography>{metaTitle}</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
              <Typography fontWeight={'bold'}>
                {language === 'en' ? 'Description: ' : 'الوصف: '}
              </Typography>
              <Typography>{metaDesc}</Typography>
            </Stack>
          </Box>
        ) : undefined}
      </Box>
    </Box>
  )
}

export default MetaAccordions
