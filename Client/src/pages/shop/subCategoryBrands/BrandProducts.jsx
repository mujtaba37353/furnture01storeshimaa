import { Box, Grid, Pagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AllProductsGridStyle } from './style'
import { useGetAllProductsByBrandIdQuery } from '../../../redux/apis/ProductApis'
import { useTranslation } from 'react-i18next'
import Card8 from '../../../components/Cards/Horizontal Rectangle/strockCustomCard7'

const BrandProducts = ({ brandId, query }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, error, isLoading } = useGetAllProductsByBrandIdQuery(
    `${brandId}&limit=24&page=${pageNumber}`
  )
  const [_, { language }] = useTranslation()

  const handlPagination = (e, page) => {
    setPageNumber(page)
  }
  const totalPages = data?.paginationResult?.totalPages
  return (
    <>
      <Grid
        container
        spacing={AllProductsGridStyle.GridSpacing}
        pt={5}
        width={'100%'}
      >
        {isLoading ? (
          <></>
        ) : data && !error ? (
          data.data.map((product, index) => (
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              lg={4}
              xl={3}
              key={index}
              wwww
              sx={AllProductsGridStyle.sx}
              width={{ xs: '97%', sm: '100%', md: '100%', lg: '90%' }}
            >
              <Box
                className="card_category Two_column"
                sx={{
                  '& button': {
                    padding: {
                      xs: '13px 30px !important',
                      md: '11px 30px !important',
                    },
                  },
                  '& .card_category': {
                    width: '100% !important',
                  },
                }}
              >
                <Card8 data={product} />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid xs={12}>
            <Typography color="red" variant="h6" px={5} align="center">
              {language === 'en' ? 'Not products found' : 'لا يوجد منتجات'}
            </Typography>
          </Grid>
        )}
      </Grid>
      {totalPages > 1 && (
        <Box
          sx={{
            direction: 'ltr',
            mt: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={pageNumber}
            variant="outlined"
            shape="rounded"
            onChange={handlPagination}
            sx={{
              '& button': {
                width: '32px',
                height: '32px',
              },
            }}
          />
        </Box>
      )}
    </>
  )
}

export default BrandProducts
