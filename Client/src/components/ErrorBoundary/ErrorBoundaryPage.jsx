import { Box, Typography, ButtonBase } from '@mui/material'
import React from 'react'

const ErrorBoundaryPage = ({ error }) => {
  return (
    <Box
      minHeight={'100vh'}
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '2rem' },
            fontWeight: 'bold',
            color: 'gray',
          }}
        >
          Oops! Something went wrong"
        </Typography>

        <Box>
          <ButtonBase
            onClick={() => (location.href = '/')}
            sx={{
              borderRadius: '2rem',
              padding: '10px 30px',
              backgroundColor: 'gray',
              marginTop: '2rem',
              bgcolor: 'gray !important',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.5rem' },
                fontWeight: 'bold',
                color: 'white',
                textalign: 'center',
              }}
            >
              Refresh page
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  )
}

export default ErrorBoundaryPage
