import {
  Avatar,
  Box,
  Stack,
  Typography,
  InputBase,
  Button,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SendIcon from '@mui/icons-material/Send'
import { imageBaseUrl } from '../../constants/baseUrl'
import { useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import moment from 'moment'
import { toast } from 'react-toastify'
import {
  useCreateCommentForProductMutation,
  useGetProductCommentsQuery,
  useRemoveCommentFromProductMutation,
} from '../../redux/apis/commentApi'
const TextField = ({ handleSubmit, placeholder, state, setState }) => {
  const [_, { language }] = useTranslation()
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '0px',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid #727272`,
        borderRadius: '25px',
        my: '10px',
        backgroundColor: '#727272',
      }}
    >
      <InputBase
        type="text"
        sx={{
          py: 1,
          px: 3,
          width: 0.97,
        }}
        placeholder={placeholder}
        value={state}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && e.target.value) {
            handleSubmit()
          }
        }}
        onChange={(e) => setState(e.target.value)}
      />
      <Button
        sx={{
          width: 0.03,
          minWidth: 0,
        }}
        onClick={() => {
          if (state) {
            handleSubmit()
          }
        }}
      >
        <SendIcon
          sx={{
            transform: language === 'ar' ? 'rotate(180deg)' : 'rotate(0)',
            color: '#fff',
          }}
        />
      </Button>
    </Box>
  )
}

const CommentCard = ({ colors, item }) => {
  const { currentUser } = useSelector((state) => state)
  const [removeCommentFromProduct] = useRemoveCommentFromProductMutation()
  const [_, { language }] = useTranslation()
  const handleRemoveComment = () => {
    removeCommentFromProduct(item._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
      })
  }
  const customMoment = (time) => {
    const custom = moment(time).locale(language).fromNow()
    return custom
  }
  return (
    <Box mb={'10px'}>
      <Box
        sx={{
          border: '0px',
          borderColor: '#727272',
          margin: ' 27px',
          marginBottom: '0px',
          borderRight: language === 'en' ? '0px' : '2px solid #727272',
          borderLeft: language === 'ar' ? '0px' : '2px solid #727272',
        }}
      >
        <Stack
          direction={'row'}
          alignItems={'flex-start'}
          gap={'20px'}
          borderRadius={'20px'}
          p={'10px'}
          sx={{
            wordBreak: 'break-word',
          }}
        >
          <Avatar src={imageBaseUrl + item?.user.image} />
          <Box>
            <Typography
              sx={{
                fontSize: '17px',
              }}
              fontWeight={'bold'}
            >
              {item.user.name}
            </Typography>
            <Typography variant={'body1'}>{item.comment}</Typography>
          </Box>
        </Stack>
      </Box>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'flex-end'}
        gap={'15px'}
        px={
          currentUser
            ? currentUser?._id !== item.user._id
              ? '55px'
              : 0
            : '10px'
        }
      >
        <Typography>
          {customMoment(
            item.createdAt === item.updatedAt ? item.createdAt : item.updatedAt
          )}
        </Typography>
        {currentUser?._id === item.user._id && (
          <Button
            sx={{ minWidth: 0, color: 'black' }}
            onClick={handleRemoveComment}
          >
            {language === 'en' ? 'delete' : 'مسح'}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

const ProductComments = ({ colors, productId }) => {
  const [_, { language }] = useTranslation()
  const { currentUser } = useSelector((state) => state)
  const [comment, setComment] = useState('')
  const [createCommentForProduct] = useCreateCommentForProductMutation()
  const { data, isLoading } = useGetProductCommentsQuery(
    `${productId}?limit=1000`
  )
  const handleSubmit = () => {
    createCommentForProduct({
      comment,
      productId,
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
        setComment('')
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  if (isLoading) {
    return null
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'none',
        width: 0.9,
        mx: 'auto',
        direction: language === 'en' ? 'ltr' : 'rtl',
        mb: '50px',
        pb: '40px',
      }}
    >
      <Box py={'15px'} mb={'15px'}>
        <Typography
          variant="h6"
          sx={{
            color: '#000',
            textAlign: language === 'en' ? 'left' : 'right',
            textTransform: 'capitalize',
          }}
        >
          {language === 'en' ? 'product comments' : 'تعليقات المنتج'}
        </Typography>
      </Box>

      {data?.data.map((item) => (
        <CommentCard item={item} key={item._id} colors={colors} />
      ))}
      {currentUser && (
        <Box mt={'20px'}>
          <Stack direction={'row'} alignItems={'center'} gap={'20px'}>
            <Avatar src={imageBaseUrl + currentUser?.image} />
            <Typography variant={'h6'}>
              {
                currentUser[
                  currentUser.name
                    ? 'name'
                    : currentUser.email
                    ? 'email'
                    : 'phone'
                ]
              }
            </Typography>
          </Stack>
          <TextField
            state={comment}
            setState={setComment}
            placeholder={
              data?.data?.find((item) => item.user._id === currentUser?._id)
                ? language === 'en'
                  ? 'Edit the comment'
                  : 'تعديل التعليق'
                : language === 'en'
                ? 'Add comment'
                : 'أضف تعليق'
            }
           
            handleSubmit={handleSubmit}
          />
        </Box>
      )}
    </Box>
  )
}

export default ProductComments
