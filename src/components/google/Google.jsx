import React, { useEffect,useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { setCurrentUser } from '../../redux/slices/userSlice' 
import { useDispatch } from 'react-redux'
import { useLazyGetMeQuery } from '../../redux/apis/UserApis' 
import { Box } from '@mui/joy'
import { baseUrl } from '../../constants/baseUrl'




const Google = () => {
  
  const [getMe] = useLazyGetMeQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const name = useLocation().pathname.concat(useLocation().search)
  useEffect(() => {
    
    // fetch(`https://reusable-servieces.onrender.com/api/v1/${name}`)
    fetch(`${baseUrl}/${name}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res,'googleasdsadsadsadsadsadsad')
        localStorage.setItem('token', res?.data?.token)
        dispatch(setCurrentUser(res?.data?.user))
        getMe()
        console.log(res,'googleasdsadsadsadsadsadsad')

        window.location.replace('/')
      })

      .catch((err) =>{ <div className="loader"></div>})
  }, [name])

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      <div className="loader"></div>
    </Box>
  )
}

export default Google
