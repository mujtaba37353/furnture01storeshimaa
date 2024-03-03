import { Box, CardMedia, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import about2 from '../../../assets/jpg/img.png'
import about3 from '../../../assets/jpg/img.png'
import about4 from '../../../assets/jpg/img.png'
import { useGetSectionByTypeQuery } from '../../../redux/apis/sectionsApi'
import { colors } from './about2.style'
import { imageBaseUrl } from '../../../constants/baseUrl'

const About2 = () => {
  const imgs = [about2, about3, about4]
  const [_, { language: lang }] = useTranslation()
  const loremIpsumEn = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ante non felis vulputate, et finibus elit feugiat. Nullam varius ligula non tortor convallis consequat. Integer et eros nec lorem pharetra sollicitudin. Cras condimentum velit vel enim suscipit, in auctor ligula cursus. Donec consequat tellus vitae arcu lacinia convallis. Duis sit amet eros ut risus eleifend lobortis. Nam faucibus urna a dolor ultrices efficitur. Sed aliquam sem nec neque iaculis fringilla. Maecenas tempor sit amet felis in cursus. Donec euismod pretium felis, a posuere tortor posuere vitae. Duis sit amet mauris ultricies, malesuada turpis eget, pharetra nisi. Integer ut condimentum turpis, id vestibulum tellus. Morbi tristique magna a mollis vestibulum.`
  const loremIpsumAr = `النص هو في الأصل نص شكلي ومؤقت في صناعات الطباعة والتنضيد. كان النص الشكلي هو النص المستخدم في الصناعة منذ القرن الخامس عشر، عندما قامت طابعة مجهولة برص مجموعة من الأحرف لصنع كتاب نموذج للطباعة. لم يقم أحد في القرن الخامس عشر بالنظر إلى النص المستخدم في الطباعة، بل قام بتصويرها كتاب ذات طابع شكلي. تم استخدامها بنجاح في صناعة الطباعة في القرن الخامس عشر. لقد عاش لوريم إيبسوم لسنوات في الكتب المدرسية والطباعة، ولذلك يعتبر الآن النص الشكلي القياسي في هذه الصناعةالنص هو في الأصل نص شكلي ومؤقت في صناعات الطباعة والتنضيد. كان النص الشكلي هو النص المستخدم في الصناعة منذ القرن الخامس عشر، عندما قامت طابعة مجهولة برص مجموعة من الأحرف لصنع كتاب نموذج للطباعة. لم يقم أحد في القرن الخامس عشر بالنظر إلى النص المستخدم في الطباعة، بل قام بتصويرها كتاب ذات طابع شكلي. تم استخدامها بنجاح في صناعة الطباعة في القرن الخامس عشر. لقد عاش لوريم إيبسوم لسنوات في الكتب المدرسية والطباعة، ولذلك يعتبر الآن النص الشكلي القياسي في هذه الصناعةالنص هو في الأصل نص شكلي ومؤقت في صناعات الطباعة والتنضيد. كان النص الشكلي هو النص المستخدم في الصناعة منذ القرن الخامس عشر، عندما قامت طابعة مجهولة برص مجموعة من الأحرف لصنع كتاب نموذج للطباعة. لم يقم أحد في القرن الخامس عشر بالنظر إلى النص المستخدم في الطباعة، بل قام بتصويرها كتاب ذات طابع شكلي. تم استخدامها بنجاح في صناعة الطباعة في القرن الخامس عشر. لقد عاش لوريم إيبسوم لسنوات في الكتب المدرسية والطباعة، ولذلك يعتبر الآن النص الشكلي القياسي في هذه الصناعة.`

  const { data, isLoading, error } = useGetSectionByTypeQuery('aboutus')
  const descLength_en = data && !error && data.data[0].description_en.length
  const descLength_ar = data && !error && data.data[0].description_ar.length
  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        mx: { xs: 1, lg: 10 },
        height: '100vh',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row-reverse' }}
        // justifyContent={'space-between'}
        spacing={2}
        sx={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
      >
        <Stack
          direction={'row'}
          flex={1}
          spacing={1}
          justifyContent={{ xs: 'center', lg: 'flex-end' }}
          // sx={{ height: '80vh' }}
        >
          <Box sx={{ flex: 1 }}>
            {[imgs[0], imgs[1]].map((img, index) => (
              <CardMedia
                key={index}
                component={'img'}
                src={img}
                sx={{
                  display: 'block',
                  width: '100%',
                  // height: 'auto',
                  height: { sm: '200px', xs: '200px', md: '250px' },
                  mb: 2.5,
                  borderRadius: '10px',
                  boxShadow: '0px 0px 10x black',
                }}
              />
            ))}
          </Box>
          <Box sx={{ alignSelf: 'center', flex: 1 }}>
            {[imgs[0], imgs[1]].map((img, index) => (
              <CardMedia
                key={index}
                component={'img'}
                src={img}
                sx={{
                  display: 'block',
                  width: '100%',
                  // height: 'auto',
                  height: { sm: '200px', xs: '200px', md: '250px' },
                  mb: 2.5,
                  borderRadius: '10px',
                }}
              />
            ))}
          </Box>
        </Stack>
        <Box
          flex={1}
          sx={{
            lineHeight: 1.5,
            fontSize: { md: 22, lg: 24, xl: 30 },
            color: '#6a6565',
          }}
        >
          <Typography variant="p">
            {lang === 'en' ? loremIpsumEn : loremIpsumAr}
          </Typography>
        </Box>
      </Stack>
      {/* <Box
        sx={{
          lineHeight: 2,
          fontSize: { md: 18, lg: 20, xl: 25 },
          color: colors.descColor,
          textAlign: lang == 'en' ? 'left' : 'right',
          mt: 8,
        }}
        dangerouslySetInnerHTML={{
          __html:
            lang === 'en'
              ? data?.data[0].description_en.slice(
                  descLength_en / 2,
                  descLength_en
                )
              : data?.data[0].description_ar.slice(
                  descLength_ar / 2,
                  descLength_ar
                ),
        }}
      /> */}
    </Box>
  )
}

export default About2

// const About2 = () => {
//   const imgs = [about2, about3, about4]
//   const [_, { language: lang }] = useTranslation()
//   const { data, isLoading, error } = useGetSectionByTypeQuery('aboutus')
//   const descLength_en = data && !error && data.data[0].description_en.length
//   const descLength_ar = data && !error && data.data[0].description_ar.length
//   return (
//     <Box
//       sx={{
//         p: { xs: 1, md: 3 },
//         mx: { xs: 1, lg: 10 },
//         height:'100vh'
//       }}
//     >
//       <Stack
//         direction={{ xs: 'column', lg: 'row-reverse' }}
//         // justifyContent={'space-between'}
//         spacing={2}
//         sx={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
//       >
//         <Stack
//           direction={'row'}
//           flex={1}
//           spacing={1}
//           justifyContent={{ xs: 'center', lg: 'flex-end' }}
//           sx={{ height: '80vh' }}
//         >
//           <Box sx={{ height: '80vh', flex: 1 }}>
//             {[imgs[0], imgs[1]].map((img, index) => (
//               <CardMedia
//                 key={index}
//                 component={'img'}
//                 src={img}
//                 sx={{
//                   display: 'block',
//                   width: '95%',
//                   height:{sm:'350px',xs:'300px',md: '360px',},
//                   mb: 2.5,
//                 }}
//               />
//             ))}
//           </Box>
//           <Box sx={{ alignSelf: 'center', flex: 1 }}>
//             {[`${imageBaseUrl}${data?.data[0].image}`, imgs[2]].map(
//               (img, index) => (
//                 <CardMedia
//                   key={index}
//                   component={'img'}
//                   src={img}
//                   sx={{
//                     display: 'block',
//                     width: '95%',
//                     height:{sm:'350px',xs:'300px',md: '400px',},
//                     mb: 2.5,
//                   }}
//                 />
//               )
//             )}
//           </Box>
//         </Stack>
//         <Box
//           flex={1}
//           sx={{
//             lineHeight: 2,
//             fontSize: { md: 18, lg: 20, xl: 25 },
//             color: colors.descColor,
//           }}
//           dangerouslySetInnerHTML={{
//             __html:
//               lang === 'en'
//                 ? data?.data[0].description_en
//                 : data?.data[0].description_ar,
//           }}
//         />
//       </Stack>
//       {/* <Box
//         sx={{
//           lineHeight: 2,
//           fontSize: { md: 18, lg: 20, xl: 25 },
//           color: colors.descColor,
//           textAlign: lang == 'en' ? 'left' : 'right',
//           mt: 8,
//         }}
//         dangerouslySetInnerHTML={{
//           __html:
//             lang === 'en'
//               ? data?.data[0].description_en.slice(
//                   descLength_en / 2,
//                   descLength_en
//                 )
//               : data?.data[0].description_ar.slice(
//                   descLength_ar / 2,
//                   descLength_ar
//                 ),
//         }}
//       /> */}
//     </Box>
//   )
// }

// export default About2
