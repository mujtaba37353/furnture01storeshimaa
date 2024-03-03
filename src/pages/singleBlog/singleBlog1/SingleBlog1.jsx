import React from 'react'
import { useParams } from 'react-router-dom'
import {
  useAddCommentMutation,
  useAddReplyForCommentMutation,
  useDeleteCommentMutation,
  useDeleteReplyFromCommentMutation,
  useGetBlogByIdQuery,
  useGetBlogByNameQuery,
} from '../../../redux/apis/blogsApi'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  CardMedia,
  InputBase,
  Button,
  Typography,
  Avatar,
  Stack,
} from '@mui/material'
import { imageBaseUrl } from '../../../constants/baseUrl'
import { useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import moment from 'moment'
import styles from './styles'
import { colors } from './styles'
import { useSelector } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
const TextField = ({ handleSubmit, placeholder, state, setState }) => {
  const [_, { language }] = useTranslation()
  return (
    <Box
      sx={{
        position: 'relative',
        border: `1px solid #aaaa`,
        borderRadius: '40px',
        display: 'flex',
        alignItems: 'center',
        my: '10px',
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
          }}
        />
      </Button>
    </Box>
  )
}
const CommentRebly = ({ item, commentId, blogId, customMoment }) => {
  const [_, { language }] = useTranslation()
  const { currentUser } = useSelector((state) => state)
  const [deleteReplyFromComment] = useDeleteReplyFromCommentMutation()

  const handleDeleteReply = () => {
    deleteReplyFromComment({
      blogId,
      payload: {
        commentId,
        replyId: item._id,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  const roles = ['rootAdmin', 'adminA', 'adminB', 'adminC', 'subAdmin']
  return (
    <Box>
      <Stack
        sx={{
          width: 0.98,
          mr: language === 'ar' ? 'auto' : 0,
          ml: language === 'en' ? 'auto' : 0,
          my: '10px',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '7.5px',
        }}
      >
        <Avatar src={imageBaseUrl + item.user.userId.image} />
        <Box
          sx={{
            bgcolor: '#eee',
            borderRadius: 4,
            p: 2,
            width: 0.96,
          }}
        >
          <Typography variant="h6" fontWeight={'bold'}>
            {!roles.includes(item.user.userId.role)
              ? item.user.userId.name
              : language === 'en'
              ? 'Admin'
              : 'مشرف'}
            <span style={{ fontSize: '14px' }}>
              {roles.includes(item.user.userId.role)
                ? undefined
                : language === 'en'
                ? ' (User) '
                : ' (مستخدم)'}
            </span>
          </Typography>
          <Typography>{item.reply}</Typography>
        </Box>
      </Stack>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'flex-end'}
        gap={'15px'}
        mt={'10px'}
        px={
          currentUser
            ? currentUser?.email !== item.user.email
              ? '55px'
              : 0
            : '10px'
        }
      >
        <Typography>{customMoment(item.createdAt)}</Typography>
        {currentUser?.email === item.user.email && (
          <Button sx={{ minWidth: 0 }} onClick={handleDeleteReply}>
            <DeleteIcon
              sx={{
                color: '#F4673B',
                cursor: 'pointer',
              }}
            />
          </Button>
        )}
      </Stack>
    </Box>
  )
}

const BlogComment = ({ item, language, blogId }) => {
  const [text, setText] = useState('')
  const [deleteComment] = useDeleteCommentMutation()
  const { currentUser } = useSelector((state) => state)
  const [addReplyForComment] = useAddReplyForCommentMutation()
  const [open, setOpen] = useState()
  const customMoment = (time) => {
    const custom = moment(time).locale(language).fromNow()
    return custom
  }
  const handleDeleteComment = () => {
    deleteComment({
      blogId,
      payload: {
        commentId: item._id,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  const handleAddRebly = () => {
    addReplyForComment({
      blogId,
      payload: {
        commentId: item._id,
        reply: text,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
        setText('')
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  return (
    <Stack direction={'row'} alignItems={'flex-start'} gap={'10px'} mb={'30px'}>
      <Avatar src={imageBaseUrl + item.user.userId.image} />
      <Box
        sx={{
          width: 0.98,
        }}
      >
        <Box
          sx={{
            bgcolor: colors.commentBg,
            p: 2,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={'bold'}
            sx={{ color: colors.commentText }}
          >
            {item.user.userId.name}
            <span style={{ fontSize: '14px' }}>
              {language === 'en' ? ' (User) ' : ' (مستخدم)'}
            </span>
          </Typography>
          <Typography sx={{ color: colors.commentText }}>
            {item.comment}
          </Typography>
        </Box>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          gap={'15px'}
          mt={'10px'}
          px={
            currentUser
              ? currentUser?.email !== item.user.email
                ? '55px'
                : 0
              : '10px'
          }
        >
          <Typography>{customMoment(item.createdAt)}</Typography>
          <Button
            onClick={() => {
              if (open) {
                setOpen(null)
              } else {
                setOpen(item)
              }
            }}
            sx={{
              color: open?._id === item?._id ? 'red' : 'initial',
            }}
          >
            {language === 'en' ? 'Reblies' : 'الردود'}
            <ArrowDropDownIcon
              sx={{
                transition: 'all 0.3s',
                transform:
                  open?._id === item?._id ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </Button>
          {item.user.email === currentUser?.email && (
            <Button sx={{ minWidth: 0 }} onClick={handleDeleteComment}>
              <DeleteIcon
                sx={{
                  color: '#F4673B',
                  cursor: 'pointer',
                }}
              />
            </Button>
          )}
        </Stack>
        {open?._id === item?._id && (
          <Box
            sx={
              {
                // height: '2000px',
                // maxHeight: open?._id === item?._id ? '4000px' : '0',
                // transition: 'all 0.3s',
                // overflow: 'hidden',
              }
            }
          >
            <Box mt={'10px'}>
              {item.replies.map((reply) => (
                <CommentRebly
                  item={reply}
                  blogId={blogId}
                  commentId={item._id}
                  open={open}
                  customMoment={customMoment}
                />
              ))}
            </Box>
            {currentUser && (
              <Box width={0.95} mr="auto">
                <TextField
                  placeholder={language === 'en' ? 'Add Rebly' : 'أضف رد'}
                  state={text}
                  setState={setText}
                  handleSubmit={handleAddRebly}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

const SingleBlog1 = () => {
  const { blogId, blogName } = useParams()
  const [_, { language }] = useTranslation()
  const { currentUser } = useSelector((state) => state)
  const {
    data: blogData,
    error: blogError,
    isLoading,
  } = useGetBlogByIdQuery(blogId)

  const [text, setText] = useState('')
  const [addComment] = useAddCommentMutation()
  const handleAddComment = () => {
    addComment({
      blogId: blogData?.data._id,
      payload: {
        comment: text,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`])
        setText('')
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  return (
    <Box
      sx={{
        direction: 'rtl',
        mb: '50px',
      }}
    >
      {isLoading ? (
        <Stack sx={styles.wrapper}>
          <div className="loader" />
        </Stack>
      ) : blogData && !blogError ? (
        <Box sx={styles.blogContainer}>
          <CardMedia
            alt={blogData.data.title.slice(0, 10)}
            component="img"
            src={imageBaseUrl + blogData.data.image}
            sx={styles.blogImage}
          />
          <Box
            variant="body1"
            sx={{ fontWeight: 'bold', mt: '25px' }}
            dangerouslySetInnerHTML={{
              __html: blogData.data.description,
            }}
          />
          {blogData.data.comments.map((item) => (
            <BlogComment item={item} blogId={blogId} language={language} />
          ))}
          {currentUser && (
            <TextField
              placeholder={language === 'en' ? 'Add comment' : 'أضف تعليق'}
              handleSubmit={handleAddComment}
              state={text}
              setState={setText}
            />
          )}
        </Box>
      ) : (
        <Stack sx={styles.wrapper}>
          <Typography variant="h6" color="error">
            {blogError.data[`error_${language}`]}
          </Typography>
        </Stack>
      )}
    </Box>
  )
}

export default SingleBlog1
