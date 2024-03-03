import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputBase,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLazyGetAllAttributesQuery } from '../../../redux/apis/attributeApi'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import { filterColors, filterMenuStyles } from './utilesStyles'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'

export function FilterAttributesMenu({ filterQuery, setFilterQuery }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [_, { language: lang }] = useTranslation()
  const { attributesData } = GenerateAttributeData()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    formik.resetForm()
    setExpanded(false)
  }
  const [expanded, setExpanded] = useState(false)
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const manipulateQuery = () => {
    let query = ''
    let selAttsValues = selectedAtts
      .reduce((item, obj) => {
        return item.concat(obj.values)
      }, [])
      .map(({ value_en }) => value_en)
    selAttsValues.map((val) => (query += `attributes.values.value_en=${val}&`))
    if (priceState) {
      query += !query ? `` : '&'
      query += `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    }
    return query
  }
  const [selectedAtts, setSelectedAtts] = useState([])
  const [priceState, setPriceState] = useState()
  const hundleAddAtt = (attribute, selectedValue, event) => {
    const existedAtt = selectedAtts.find(
      (item) => item.key_en === attribute.key_en
    )
    const { checked, value } = event.target
    if (checked) {
      existedAtt
        ? setSelectedAtts(
            selectedAtts.map((item) =>
              item.key_en === attribute.key_en
                ? {
                    key_en: attribute.key_en,
                    key_ar: attribute.key_ar,
                    values: [...existedAtt.values, { ...selectedValue }],
                  }
                : item
            )
          )
        : setSelectedAtts([
            ...selectedAtts,
            {
              key_en: attribute.key_en,
              value_en: attribute.key_ar,
              values: [selectedValue],
            },
          ])
    } else {
      existedAtt?.values?.length > 1
        ? setSelectedAtts(
            selectedAtts.map((item) =>
              item.key_en === existedAtt.key_en
                ? {
                    ...existedAtt,
                    values: existedAtt?.values.filter(
                      (val) => val.value_en !== value
                    ),
                  }
                : item
            )
          )
        : setSelectedAtts(
            selectedAtts.filter((sel) => sel.key_en !== existedAtt?.key_en)
          )
    }
  }
  useEffect(() => {
    setFilterQuery(manipulateQuery())
  }, [selectedAtts, priceState])
  const formik = useFormik({
    initialValues: { from: '', to: '' },
    validationSchema: object({
      from: string().required(),
      to: string().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      setPriceState(values)
      let submitQueries = `priceBeforeDiscount[gte]=${values.from}&priceBeforeDiscount[lte]=${values.to}`
      setFilterQuery(query ? `${query}&${submitQueries}` : submitQueries)
      resetForm()
    },
  })
  const refetchAllProducts = (e) => {
    setFilterQuery('')
    setSelectedAtts([])
    setPriceState()
  }
  const clearPriceFilter = () => {
    let priceQueries = `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    setFilterQuery(filterQuery.replace(priceQueries, ''))
    setTimeout(() => {
      setPriceState()
    }, 240)
  }
  const submitButtonRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      // Add any additional logic or validation here if needed
      // Then disable the submit button
      disableSubmitButton();
    }
  };

  const disableSubmitButton = () => {
    // Add logic to disable the submit button
    // For example, you might have a state variable like isSubmitButtonDisabled
    // and you can set it to true to disable the button
    // this.setState({ isSubmitButtonDisabled: true });
  };

  useEffect(() => {
    // Attach the keydown event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      sx={{
        width: 'auto',
        gap: '10px',
      }}
    >
      <Box>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={
            <FilterAltOutlinedIcon
              sx={{
                color: `${filterColors.filter.buttonColor} !important`,
              }}
            />
          }
          sx={{
            bgcolor: `${filterColors.filter.buttonBg} !important`,
            py: '10px',
          }}
        >
          <Typography sx={filterMenuStyles.menuButton}>
            {lang === 'en' ? 'filter by' : 'تصفية حسب'}
          </Typography>
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            maxHeight: 600,
            p: 0,
            direction: lang === 'en' ? 'ltr' : 'rtl',
          }}
        >
          {attributesData?.length > 0 &&
            attributesData?.map((attribute) => (
              <Accordion
                expanded={expanded === attribute.key_en}
                onChange={handleChange(attribute.key_en)}
                sx={{
                  m: '0 !important',
                }}
              >
                <AccordionSummary
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    {selectedAtts.includes((item) =>
                      item.key_en == attribute.key_en ? (
                        <CheckBoxIcon
                          sx={{
                            color: 'blue',
                            fontSize: '20px',
                          }}
                        />
                      ) : undefined
                    )}
                    <Typography sx={filterMenuStyles.checkBoxLabel}>
                      {attribute[`key_${lang}`]}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    overflow: 'hidden',
                  }}
                >
                  {attribute.values?.map((value) => (
                    <Stack sx={filterMenuStyles.checkBoxContainer}>
                      <input
                        type="checkbox"
                        id={value.value_en}
                        value={value.value_en}
                        checked={selectedAtts.find(
                          (item) =>
                            item.key_en === attribute.key_en &&
                            item.values.find(
                              ({ value_en }) => value_en === value.value_en
                            )
                        )}
                        style={{
                          accentColor: 'blue',
                        }}
                        onChange={(event) =>
                          hundleAddAtt(attribute, value, event)
                        }
                      />
                      <Typography
                        component="label"
                        htmlFor={value.value_en}
                        sx={filterMenuStyles.checkBoxLabel}
                      >
                        {value[`value_${lang}`]}
                      </Typography>
                    </Stack>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          <Accordion
            expanded={expanded === 'price'}
            onChange={handleChange('price')}
            sx={{
              m: '0 !important',
            }}
          >
            <AccordionSummary
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  ...filterMenuStyles.priceBtn,
                  fontWeight: 'normal',
                  color: '#414042',
                  fontSize: '20px',
                }}
              >
                {lang === 'en' ? 'Price' : 'السعر'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box component="form" onSubmit={formik.handleSubmit}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 200,
                  }}
                >
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'From' : 'من'}
                    </Typography>
                    <InputBase
                      name="from"
                      type="number"
                      value={formik.values.from}
                      onChange={formik.handleChange}
                       disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.from && formik.touched.from
                            ? 'red'
                            : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'To' : 'إلي'}
                    </Typography>
                    <InputBase
                      type="number"
                      name="to"
                      value={formik.values.to}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.to && formik.touched.to ? 'red' : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Button
                    disabled={priceState}
                    type="submit"
                    sx={filterMenuStyles.formPriceBtn}
                    ref={submitButtonRef}
                  >
                    {lang === 'en' ? 'Search by price' : 'بحث بالسعر'}
                  </Button>
                  {priceState && (
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={clearPriceFilter}
                    />
                  )}
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Menu>
      </Box>
      {selectedAtts?.length > 0 || filterQuery ? (
        <RefreshIcon
          sx={{
            color: filterColors.filter.checkBoxLabel,
            cursor: 'pointer',
          }}
          onClick={refetchAllProducts}
        />
      ) : undefined}
    </Stack>
  )
}
const GenerateAttributeData = () => {
  const [getAllAttributes] = useLazyGetAllAttributesQuery()
  const [attributesData, setAtts] = useState()
  useEffect(() => {
    getAllAttributes()
      .unwrap()
      .then((res) => {
        setAtts(res.data)
      })
      .catch((err) => {
        setAtts()
      })
  }, [])
  return {
    attributesData,
  }
}
