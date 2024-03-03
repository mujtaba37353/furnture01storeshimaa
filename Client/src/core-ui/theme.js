import { createTheme } from '@mui/material'

export const theme = createTheme({
  direction: localStorage?.i18nextLng==='en'?'ltr':"rtl"||"horizontal",
})
