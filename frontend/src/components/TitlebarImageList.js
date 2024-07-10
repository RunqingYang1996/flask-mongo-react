import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
  height: 400, // 设置固定高度
  width: '100%', // 让图片宽度填满Card
  objectFit: 'cover', // 保持图片比例并裁剪
});

const GalleryTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

export default function TitlebarImageList() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/images')  // 确保URL指向Flask服务器
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  return (
    <div>
      <GalleryTitle variant="h2">Image Gallery</GalleryTitle>
      <Grid container justifyContent="center" spacing={4}>
        {images.map((item, index) => (
          <Grid item key={index}>
            <StyledCard>
              <StyledCardMedia
                component="img"
                image={`data:image/png;base64,${item.img}`}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by: {item.author}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
