import React, { useState, useRef } from 'react'
import { Box, IconButton, VideoPlayerIcon } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

const VideoPlayer = ({ videoPath }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '97%', sm: '95%', md: '100%' },
        marginTop: '10px',
        mx: 'auto',
        height: ' 100%',
        padding: { xs: '0px', lg: '25px' },
      }}
    >
      <img
        src={videoPath}
        alt="Placeholder Image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />
      <IconButton
        onClick={togglePlay}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // backgroundColor: 'rgba(0,0,0,0.3)',
          backgroundColor: 'rgb(122 122 86 / 63%)',
          color: '#fff',
          
        }}
      >
        {isPlaying ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </IconButton>
    </Box>
  )
}

export default VideoPlayer
