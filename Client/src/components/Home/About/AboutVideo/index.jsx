import {
  Box,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import videoPath from '../../../../assets/jpg/img.png'
import { useGetSectionByTypeQuery } from '../../../../redux/apis/sectionsApi'
import { Colors } from './styles'
import styles from './styles'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { FixedColors } from '../../FixedCard/MostSeller/FixedCardColors'
const ErrorSection = ({ error, lang }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography
        fontSize={'1.5rem'}
        my={10}
        textAlign={'center'}
        color="error"
      >
        {error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}
const AboutHeader = ({ title, desc }) => {
  const navigate = useNavigate()
  const loremIpsumEn = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ante non felis vulputate, et finibus elit feugiat. Nullam varius ligula non tortor convallis consequat. Integer et eros nec lorem pharetra sollicitudin. Cras condimentum velit vel enim suscipit, in auctor ligula cursus. Donec consequat tellus vitae arcu lacinia convallis. Duis sit amet eros ut risus eleifend lobortis. Nam faucibus urna a dolor ultrices efficitur. Sed aliquam sem nec neque iaculis fringilla. Maecenas tempor sit amet felis in cursus. Donec euismod pretium felis, a posuere tortor posuere vitae. Duis sit amet mauris ultricies, malesuada turpis eget, pharetra nisi. Integer ut condimentum turpis, id vestibulum tellus. Morbi tristique magna a mollis vestibulum.`;
  const loremIpsumAr = `النص هو في الأصل نص شكلي ومؤقت في صناعات الطباعة والتنضيد. كان النص الشكلي هو النص المستخدم في الصناعة منذ القرن الخامس عشر، عندما قامت طابعة مجهولة برص مجموعة من الأحرف لصنع كتاب نموذج للطباعة. لم يقم أحد في القرن الخامس عشر بالنظر إلى النص المستخدم في الطباعة، بل قام بتصويرها كتاب ذات طابع شكلي. تم استخدامها بنجاح في صناعة الطباعة في القرن الخامس عشر. لقد عاش لوريم إيبسوم لسنوات في الكتب المدرسية والطباعة، ولذلك يعتبر الآن النص الشكلي القياسي في هذه الصناعة.`;

  const [, { language: lang }] = useTranslation()
  return (
    <Box
      width={0.9}
      mx={'auto'}
      sx={{
        textAlign: lang === 'en' ? 'left' : 'right',
        paddingTop: { xs: '1rem', md: '2rem' },
        // backgroundColor: '#faebd77a',
      }}
    >
      {/* Main Title */}
      <Typography
        variant={'h3'}
        sx={{
          ...styles.aboutSection.typography,
          textAlign: lang === 'en' ? 'left' : 'right',
          fontSize: { xs: '20px', sm: '20px', md: '40px', lg: '50px' },
        }}
      >
  {lang === 'en' ? 'Lorem Ipsum Main Title' : 'عنوان رئيسي بنص لوريم إيبسوم'}
      </Typography>

      {/* subTitle */}
      <Box
        variant="h6"
        sx={{
          ...styles.aboutSection.dangerously,
          fontSize: { xs: '15px', sm: '15px', md: '20px', lg: '25px' },
          textAlign: lang === 'en' ? 'left' : 'right',
          '& p': {
            margin: '0px !important',
          },
        }}
        // i need to make it end "..."

        // dangerouslySetInnerHTML={{
        //   __html: desc ? `${desc.slice(0, 150)}....` : '',
        // }}
      />
        {lang === 'en' ? loremIpsumEn.slice(0, 100) : loremIpsumAr.slice(0, 100)}
      <Typography
        onClick={() => {
          navigate('/aboutUs')
        }}
        sx={{
          color: '#000',
          cursor: 'pointer',
          width: '60px',
          borderRadius: '50%',
          backgroundColor: '#727272', 
          padding: '10px 20px',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: '#727272', 
            color: '#fff',
          },
        }}
      >
    {lang === 'en' ? 'More' : 'المزيد'}
    </Typography> 
    </Box>
  )
}
const AboutVideo = () => {
  const [, { language: lang }] = useTranslation()
  const theme = useTheme()

  const phoneScreen = useMediaQuery(theme.breakpoints.down('md'))

  const { data, isSuccess, isError, error, isLoading } =
    useGetSectionByTypeQuery('aboutus')
  const desc = data?.data[0][`description_${lang}`]
  const title = data?.data[0][`title_${lang}`]
  return (
    <>
      <Box
        sx={{
          textAlign: 'center',
          mb: 7,
          marginTop: '-30PX',
          marginBottom: '40px',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '2.3rem', sm: '2.5rem', lg: '4rem' },
            fontWeight: 'bold',
            color: FixedColors.titleColor,
          }}
        >
          {lang === 'en' ? 'About Us' : 'عننا'}
        </Typography>
      </Box>
      <Box bgcolor={Colors.bgColor} sx={{}}>
        {isLoading && <span className="loader"></span>}
        {isError && <ErrorSection error={error} />}
        {!isLoading && !isError && isSuccess && (
          <>
            <Grid
              container
              width={'100%'}
              sx={{
                ...styles.gridContainer,
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                flexDirection: phoneScreen ? 'column-reverse' : 'row',
              }}
            >
              {/* Description and title */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                p={2}
                sx={styles.aboutSection.flexHeader}
              >
                <AboutHeader title={title} desc={desc} />
              </Grid>

              {/* video */}
              <Grid
                item
                xs={12}
                md={5.5}
                sx={{
                  margin: 'auto',
                  marginRight: {
                    lg: lang === 'ar' ? "'50px'" : '0px',
                  },
                  marginLeft: {
                    lg: lang === 'ar' ? "'50px'" : '0px',
                  },
                }}
              >
                <Box>
                  <VideoPlayer videoPath={videoPath} />
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  )
}
export default AboutVideo
