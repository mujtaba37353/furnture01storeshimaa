import React from 'react'
import { useGetMostNewiestProductsQuery } from '../../../../redux/apis/ProductApis.js'
import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Card3 from '../../../Cards/Horizontal Rectangle/StrokeCard3/index.jsx'
import { FixedColors } from './FixedCardColors.js'



const ErrorSection = ({ isError, error }) => {
    const [, { language: lang }] = useTranslation()

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
                {isError
                    ? error?.data && error?.data[`error_${lang}`]
                    : error?.data && error?.data[`error_${lang}`]}
            </Typography>
        </Box>
    )
}

const FixedCardNewest = () => {
    const { data, isSuccess, isError, isLoading, error } =useGetMostNewiestProductsQuery()
    const [, { language: lang }] = useTranslation()
    const MostData = data?.data;

    return (
        <Box my={2}>

            {isError && error && <ErrorSection error={error} isError={isError} />}
            {isSuccess && !isError && data?.data?.length > 0 && (
                <>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 7,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '2.3rem', sm: '2.5rem', lg: '4rem' },
                                fontWeight: 'bold',
                                color: FixedColors.titleColor||'black',
                                'margin-top': '-158px'
                            }}
                        >
                            {lang === 'en' ? "Newest" : "الاحدث"}
                        </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', md: 'row' }}
                        width={'80%'}
                        mx={'auto'}
                        justifyContent={{ xs: 'center', md: 'space-around' }}
                        alignItems={{ xs: 'center', md: 'center' }}
                        gap={3}
                        
                    >
                        {MostData?.map((item, index) => (
                            <Box key={index} sx={{
                                width: { xs: '300px', sm: '350px', md: '400px' },
                            }}>
                                <Card3 data={item} />
                            </Box>
                        ))}

                    </Stack>
                </>
            )}

        </Box>
    )
}

export default FixedCardNewest