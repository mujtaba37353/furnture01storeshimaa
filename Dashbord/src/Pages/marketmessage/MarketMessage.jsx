import {
  Box,
  Button,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField
} from '@mui/material'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@emotion/react'
import { useFormik } from 'formik'
import Radio from '@mui/material/Radio'
import FormControl from '@mui/material/FormControl'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { useGetAllUsersQuery } from '../../api/user.api'
import { useSendEmailMessageMutation } from '../../api/Messages'
import { toast } from 'react-toastify'
import SearchIcon from "@mui/icons-material/Search";

export default function MarketMessage () {
  const [,{language:lang}]=useTranslation()
  const [sendEmailMessage, { isLoading: isLoadingEmails }] =
    useSendEmailMessageMutation();
  const {
    i18n: { language }
  } = useTranslation()
  const { colors, customColors } = useTheme()

  // ?limit=100&role=user
  const {
    data: users,
    isError: usersError,
    isLoading,
    error
  } = useGetAllUsersQuery('limit=1000000')
  // yup
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectError, setSelectError] = useState('');
  const [usersData,setUsers]=useState([])

useEffect(()=>{

  if(!isLoading&&!usersError){
    setUsers(users?.data)
  }
},[users])
  const handleUserChange = event => {
    const {
      target: { value }
    } = event
    setSelectedUsers(typeof value === 'string' ? value.split(',') : value)
  }


  
  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    resetForm,
    handleBlur
  } = useFormik({
    initialValues: {
      message: '',
      SelectedType: 'ALL',
      address: '',
      subaddress: ''
    },
    validationSchema: Yup.object({
      address: Yup.string().required(language === 'en' ? 'Required' : 'مطلوب'),
      message: Yup.string().required(language === 'en' ? 'Required' : 'مطلوب')
    }),
    onSubmit: values => {
      if (values.SelectedType === 'ALL') {
        const formatedData = {
          email: [],
          subject: values?.address,
          subSubject: values?.subaddress,
          message: values?.message
        }

        sendEmailMessage(formatedData)
          .unwrap()
          .then(() => {
            toast.success(
              language === 'en'
                ? 'successfull send your Message'
                : 'تم ارسال الرساله بنجاح'
            )
            setSelectedUsers([])
            resetForm()
          })
          .catch(() => {
            toast.error(
              language === 'en'
                ? 'there is a problem while send Your Message'
                : 'هناك مشكله في ارساله الرساله '
            )
          })
      } else {
        if (!selectedUsers.length && values?.SelectedType !== 'ALL') {
          setSelectError(
            language === 'en'
              ? 'please select users first'
              : 'من فضلك اختر المستخدمين اولا '
          )
          return
        } else {
          const usersIds = users?.data?.reduce((acc, user) => {
            const IsSelected = selectedUsers.some(email => email === user.email)
            if (IsSelected) acc.push(user?.email)

            return acc
          }, [])
          setSelectError('')
           const formatedData = {
            email: usersIds.filter(Boolean),
            subject: values?.address,
            subSubject: values?.subaddress,
            message: values?.message
          }
          sendEmailMessage(formatedData)
            .unwrap()
            .then(() => {
              toast.success(
                language === 'en'
                  ? 'successfull send your Message'
                  : 'تم ارسال الرساله بنجاح'
              )
              resetForm()
              setSelectedUsers([])
            })
            .catch(() => {
              toast.error(
                language === 'en'
                  ? 'there is a problem while send Your Message'
                  : 'هناك مشكله في ارساله الرساله '
              )
            })
        }
      }
    }
  })

  // yup
  useEffect(()=>{
     if(values?.SelectedType==='ALL'){
       setUsers(users?.data)
    }
  },[values?.SelectedType])
  const breadcrumbs = [
    <Link
      underline='hover'
      key='1'
      color='inherit'
      to='/'
      style={{ textDecoration: 'none', color: customColors.text }}
    >
      {language === 'en' ? 'Home' : 'الرئيسية'}
    </Link>,

    <Typography key='3' color='text.primary' sx={{ color: '#00e3d2' }}>
      {language === 'en' ? 'Mail Messages' : 'الرسائل البريديه'}
    </Typography>
  ]

  return (
   <>
   
   {!usersError&&!isLoadingEmails&&!usersError? <Stack>
      <Box sx={{ py: '20px', px: { xs: '10px', md: '40px' } }}>
        <Typography variant='h4' component='h1' gutterBottom>
          {language === 'en' ? 'Email Message' : 'الرسائل البريديه'}
        </Typography>
        <Breadcrumbs
          separator={
            language === 'en' ? (
              <NavigateNextIcon fontSize='small' />
            ) : (
              <NavigateBeforeIcon fontSize='small' />
            )
          }
          aria-label='breadcrumb'
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Box
          sx={{
            width: { xs: '98%', lg: '88%' },
            background: customColors.bg,
            py: '20px',
            mx: 'auto',
            my: 5,
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            borderRadius: '10px'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack sx={{ width: { xs: '90%', lg: '80%' }, mx: 'auto' }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                gap={3}
                justifyContent={'space-between'}
              >
                <Box sx={{ width: { xs: '100%', md: '90%' } }}>
                  <Typography sx={{ color: customColors.label, my: 3 }}>
                    {language === 'en' ? 'address' : 'العنوان '}
                  </Typography>
                  <TextField
                    name='address'
                    type='text'
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.address}
                    helperText={
                      touched.message && errors.address ? errors.address : ''
                    }
                    error={touched.address && errors.address}
                    variant='outlined'
                    sx={{
                      '&:hover': {
                        fieldset: { borderColor: customColors.inputField }
                      },
                      fieldset: { borderColor: customColors.inputField }
                    }}
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', md: '90%' } }}>
                  <Typography sx={{ color: customColors.label, my: 3 }}>
                    {language === 'en' ? 'sub address' : ' العنوان الفرعي'}
                  </Typography>
                  <TextField
                    name='subaddress'
                    fullWidth
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.subaddress}
                    helperText={
                      touched.subaddress && errors.subaddress
                        ? errors.subaddress
                        : ''
                    }
                    error={touched.subaddress && errors.subaddress}
                    variant='outlined'
                    sx={{
                      '&:hover': {
                        fieldset: { borderColor: customColors.inputField }
                      },
                      fieldset: { borderColor: customColors.inputField }
                    }}
                  />
                </Box>
              </Stack>

              <Typography sx={{ color: customColors.label, mb: '4px', my: 3 }}>
                {language === 'en' ? 'Message content' : 'نص  الرساله '}
              </Typography>
              <TextField
                name='message'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.message}
                helperText={
                  touched.message && errors.message ? errors.message : ''
                }
                error={touched.message && errors.message}
                multiline
                rows={4}
                variant='outlined'
                sx={{
                  '&:hover': {
                    fieldset: { borderColor: customColors.inputField }
                  },
                  fieldset: { borderColor: customColors.inputField }
                }}
              />

              <Stack
                mt='10px'
                direction={{
                  md: 'column',
                  xs: 'column'
                }}
                alignItems={{
                  md: 'flex-sater',
                  xs: 'flex-start',
                  justifyContent: 'flex-start'
                }}
                flexWrap={'wrap'}
                gap={{
                  md: '20px',
                  xs: '5px'
                }}
              >
                <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                  <Radio
                    id={'select'}
                    name={'SelectedType'}
                    value={'ALL'}
                    onChange={e => {
                      e.target.value === 'ALL' && setSelectedUsers([]);


                      setUsers(setUsers(()=>([...users?.data])))
                      handleChange(e)
                    }}
                    checked={values?.SelectedType === 'ALL'}
                    sx={{ padding: 0 }}
                  />
                  <Typography
                    component={'label'}
                    htmlFor={'ALL'}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    {language === 'en' ? 'ALL' : 'كل المستخدمين'}
                  </Typography>
                </Stack>

               
               
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  gap={'5px'}
                  width='100%'
                >
                  <Radio
                    id={'select'}
                    name={'SelectedType'}
                    value={'select'}
                    onChange={handleChange}
                    checked={values?.SelectedType === 'select'}
                    sx={{ padding: 0 }}
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: '100%'
                    }}
                  >
                    <Box>
                      <FormControl sx={{ my: 1, width: '100%' }}>
                        <Select
                          labelId='demo-multiple-checkbox-label'
                          id='demo-multiple-checkbox'
                          multiple
                          disabled={values?.SelectedType === 'ALL'}
                          value={selectedUsers}
                          onChange={handleUserChange}
                          input={
                            <OutlinedInput
                            // sx={{padding:'10px',height:'40px',width:'100%'}}
                            />
                          }
                          renderValue={selected => selected.join(', ')}
                          sx={{
                            width: '100%'
                          }}
                          // MenuProps={users?.data}
                        >
                          {
                            console.log(usersData)
                          }
                          {!isLoading && !usersError && usersData?.length
                            ? usersData
                                ?.filter(user => !user.phone)
                                .map(user => {
                                  return (
                                    <MenuItem key={user.id} value={user.email}>
                                      <Checkbox
                                        checked={
                                          selectedUsers?.indexOf( user?.email) >
                                            -1 || values?.SelectedType === 'ALL'
                                        }
                                      />
                                      <ListItemText
                                        primary={
                                          user.name
                                            ? user.name
                                            : user.email.split('@')[0]
                                        }
                                      />
                                    </MenuItem>
                                  )
                                })
                            : null}
                        </Select>
                        {/* <InputLabel id="demo-multiple-checkbox-label" sx={{ textAlign: 'right', marginLeft: 'auto' }}>select</InputLabel> */}
                      </FormControl>
                      <Typography component={'p'}>{selectError}</Typography>
                    </Box>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
            <></>
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
                type='submit'
                variant='outlined'
                sx={{
                  bgcolor: `${colors.main} !important`,
                  color: '#fff',
                  textTransform: 'capitalize',
                 border: `1px solid ${colors.main} !important`,
                 px: 3,
                  py: 1,
                  fontSize: '1rem',
                  
                }}
                disabled={isLoadingEmails}
              >
                {language === 'en' ? 'send' : 'ارسال'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Stack>: 
    
    <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                            color: 'red',
                            height:'100vh',
                            display:'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >

                          {
                            console.log(error,'errorerror')
                          }
                          {
                            error?.status!=="FETCH_ERROR"?
                                                <>    {error?.data[`error_${lang}`]}  </>

                            :<>
                            FETCH_ERROR"
                            </>
                           }
                        </Typography>}
   </>
  )
}
