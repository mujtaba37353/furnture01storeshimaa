import { useGetBannerSectionQuery } from '../../../../APIs/bannerApi'
import { Box } from '@mui/material'
import { imageBaseUrl } from '../../../../APIs/baseUrl'
const HorizontalBanner = () => {
  const { data } = useGetBannerSectionQuery(undefined)

  const banner = data?.data.filter((b) => b.alignment === 'horizontal')[0]
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box
        width={'50%'}
        mx={'auto'}
        height={{ md: '25vh', sm: '20vh', xs: '15vh', lg: '30vh' }}
        my={5}
        sx={{
          background: `url("${imageBaseUrl + banner?.image}") center center`,
          backgroundSize: '100% ',
          backgroundRepeat: 'no-repeat',
        }}
      ></Box>
    </Box>
  )
}

export default HorizontalBanner
