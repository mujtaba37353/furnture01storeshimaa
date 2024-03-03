import { useGetBannerSectionQuery } from '../../../../APIs/bannerApi'
import { Box, CardMedia } from '@mui/material'
import { imageBaseUrl } from '../../../../APIs/baseUrl'
const VerticalBanner = () => {
  const { data } = useGetBannerSectionQuery(undefined)

  const bannerVertical = data?.data.filter((b) => b.alignment === 'vertical')[0]
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box width={'30%'} height={'100%'}>
        <CardMedia
          component="img"
          height="100%"
          width="100%"
          image={imageBaseUrl + bannerVertical?.image}
        />
      </Box>
    </Box>
  )
}

export default VerticalBanner
