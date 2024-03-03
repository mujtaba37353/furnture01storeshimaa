import { Chart } from 'react-google-charts'
import { useGetAllVisitorsLocationQuery } from '../../api/history.api'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'

const OrderLoading = () => {
  const { customColors } = useTheme()
  return (
    <Box height={'60vh'} display={'grid'} sx={{ placeItems: 'center' }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  )
}

const OrderError = ({ error }) => {
  const { colors } = useTheme()
  const {
    i18n: { language }
  } = useTranslation()
  return (
    <Box height={'60vh'} display={'grid'} sx={{ placeItems: 'center' }}>
      <Typography variant={'h5'} color={colors.dangerous}>
        {language === 'en' ? error?.data?.error_en : error?.data?.error_ar}
      </Typography>
    </Box>
  )
}

const GeoChart = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useGetAllVisitorsLocationQuery()
  const { colors } = useTheme()
  if (isLoading) return <OrderLoading />
  if (isError) return <OrderError error={error} />

  // Chart options
  const options = {
    region: 'world',
    displayMode: 'regions',
    resolution: 'countries',
    colorAxis: { colors: ['#e7711c', '#4374e0'] },
    backgroundColor: colors.bg
  }

  return (
    <Chart
      sx={{ width: '100%', height: '500px' }}
      backgroundColor='black'
      chartType='GeoChart'
      data={isSuccess && data?.data}
      options={options}
      loader={<div>Loading Chart</div>}
    />
  )
}

export default GeoChart
