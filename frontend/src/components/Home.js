import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
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
import Button from '@mui/material/Button';
import BackgroundImage from './images_title/unsplash.jpg';  // 导入你的背景图片
import './CardStyles.css'; // 导入卡片样式

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
  right: theme.spacing(3),
  top: theme.spacing(3),  // 确保按钮在顶部对齐
  fontSize: '3rem', // 使图标变大
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),  // 与上方图片保持一定距离
}));

const StyledButton = styled(Button)(({ theme, active }) => ({
  textTransform: 'none', // 禁止文本全部大写
  padding: theme.spacing(1, 2), // 调整按钮的内边距，使按钮变短
  fontSize: '1rem', // 增大字体
  margin: theme.spacing(1), // 按钮之间的间距
  borderRadius: '12px', // 圆滑边角
  backgroundColor: active ? theme.palette.primary.main : 'white',
  color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: 'none', // 去除阴影效果
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: 'none', // 确保悬停时也没有阴影效果
  },
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
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    fetchImages('');
  }, []);

  const fetchImages = (type) => {
    const url = type ? `http://127.0.0.1:5000/api/images/${type}` : 'http://127.0.0.1:5000/api/images';
    fetch(url)
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleClick = () => {
    setDrawerOpen(true);
  };

  const handleButtonClick = (type) => () => {
    setActiveButton(type);
    fetchImages(type);
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
        <MenuButton color="inherit" aria-label="menu" onClick={handleClick}>
          <MenuIcon fontSize="inherit" /> {/* 修改这里才能调整icon大小 */}
        </MenuButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </GalleryHeader>
      <Grid container justifyContent="center" spacing={2} style={{ marginTop: 16 }}>
        <Grid item>
          <StyledButton
            variant="contained"
            active={activeButton === ''}
            onClick={handleButtonClick('')}
          >
            All
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            active={activeButton === 'Blender_Geometry'}
            onClick={handleButtonClick('Blender_Geometry')}
          >
            Blender Geometry
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            active={activeButton === 'Blender_Shader'}
            onClick={handleButtonClick('Blender_Shader')}
          >
            Blender Shader
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            active={activeButton === 'Unity_Shader'}
            onClick={handleButtonClick('Unity_Shader')}
          >
            Unity Shader
          </StyledButton>
        </Grid>
      </Grid>
      <GridContainer container justifyContent="center" spacing={4}>
        {images.map((item, index) => (
          <Grid item key={index}>
            <div className="card-container">
              <div className="card">
                <div className="front" style={{ backgroundImage: `url(data:image/png;base64,${item.img})` }}>
                  <div className="card-content">
                    {/* 此处可以添加前面卡片内容 */}
                  </div>
                </div>
                <div className="back">
                  <h1>{item.title}</h1>
                  <p>Additional info on the back of the card</p>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </GridContainer>
    </div>
  );
}
