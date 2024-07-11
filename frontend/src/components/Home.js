import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import BackgroundImage from './images_title/unsplash.jpg';  // 导入你的背景图片

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200, // 设置固定高度
  width: '100%', // 让图片宽度填满Card
  objectFit: 'cover', // 保持图片比例并裁剪
});

const GalleryHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${BackgroundImage})`,  // 设置背景图片
  backgroundSize: 'cover',  // 调整背景图片大小
  color: 'white',
  padding: 0,
  position: 'relative',
  height: '30vh',  // 调整高度
  width: '100%',  // 确保宽度填满视口
  boxSizing: 'border-box',
  margin: 0,  // 确保没有外边距
}));

const GalleryTitle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textAlign: 'center',
  margin: 0,  // 确保没有外边距
  padding: theme.spacing(2),
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),  // 确保按钮在顶部对齐
  fontSize: '2rem', // 使图标变大
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),  // 与上方图片保持一定距离
}));

const options = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'My Workspace', icon: <WorkIcon />, path: '/myworkspace' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { label: 'Logout', icon: <ExitToAppIcon />, path: '/logout' },
];

export default function Home() {
  const [images, setImages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/images')  // 确保URL指向Flask服务器
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = (
    <List>
      {options.map((option) => (
        <ListItem button key={option.label} component={Link} to={option.path} onClick={toggleDrawer(false)}>
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.label} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <div>
      <GalleryHeader>
        <GalleryTitle variant="h2">Gallery</GalleryTitle>
        <MenuButton color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </MenuButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </GalleryHeader>
      <GridContainer container justifyContent="center" spacing={4}>
        {images.map((item, index) => (
          <Grid item key={index}>
            <Tooltip title={`Author: ${item.author}`}>
              <StyledCard>
                <CardActionArea>
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
                </CardActionArea>
              </StyledCard>
            </Tooltip>
          </Grid>
        ))}
      </GridContainer>
    </div>
  );
}
