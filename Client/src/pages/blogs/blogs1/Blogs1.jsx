import React from 'react';
import { Box, Grid, Typography, CardMedia, Stack } from '@mui/material';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGetAllBlogsQuery } from '../../../redux/apis/blogsApi';
import { imageBaseUrl } from '../../../constants/baseUrl';
import img1 from '../../../assets/jpg/img.png';
import img2 from '../../../assets/jpg/img.png';
import img3 from '../../../assets/jpg/img.png';
import moment from 'moment';

const BlogCard = ({ language, item }) => {
  const staticImages = [img1, img2, img3, img1, img2, img3];

  return (
    <Box sx={{ ...styles.card, direction: 'rtl' }}>
      <Box elevation={3}>
        <Grid container spacing={2}>
          {staticImages.map((image, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <CardMedia
                component="img"
                src={image}
                alt={`Static Image ${index + 1}`}
                style={{ width: '100%', height: 'auto' }}
              />
            </Grid>
          ))}
        </Grid>
        <div>
          <Typography variant="overline" color="textSecondary">
            {moment(item.createdAt).fromNow()}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" sx={styles.blogTitle}>
            {item.title}
          </Typography>
          <Box
            variant="body2"
            sx={styles.blogDesc}
            dangerouslySetInnerHTML={{
              __html:
                item.description.length > 200
                  ? item.description.slice(0, 200) + '...'
                  : item.description,
            }}
          />
        </div>
        <Box sx={styles.seeMore}>
          <Link to={`/blogs/${item._id}/${item.title.replace(/\s/g, '-')}`}>
            {language === 'en' ? 'See More' : 'شاهد المزيد'}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const Blogs1 = () => {
  const [_, { language }] = useTranslation();
  const staticImages = [img1, img2, img3, img1, img2, img3];

  const {
    data: dataBlogs,
    error: errorBlogs,
    isLoading,
  } = useGetAllBlogsQuery();

  return (
    <Box sx={styles.root}>
      <Box sx={styles.container}>
        <div sx={styles.header}>
          <Typography variant="h3" component="h2" gutterBottom align={'center'}>
            {language === 'en' ? 'Blogs' : 'مدوناتنا'}
          </Typography>
        </div>
        <Stack direction={'row'} justifyContent={'center'} flexWrap={'wrap'}>
          <>
          <Grid container spacing={2}>
            {staticImages.map((image, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <CardMedia
                  component="img"
                  src={image}
                  alt={`Static Image ${index + 1}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Grid>
            ))}
          </Grid>
          </>
        </Stack>
      </Box>
    </Box>
  );

};

export default Blogs1;
