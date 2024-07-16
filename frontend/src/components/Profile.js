import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider,
  styled,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import axios from 'axios';

import BackgroundImage from './images_title/unsplash.jpg'; // Import your background image

const GalleryHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${BackgroundImage})`, // Set background image
  backgroundSize: 'cover',
  color: 'white',
  padding: 0,
  position: 'relative',
  height: '30vh',
  width: '100%',
  boxSizing: 'border-box',
  margin: 0,
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(5), // 增加顶部距离
  padding: theme.spacing(2),
  textAlign: 'center',
  boxShadow: theme.shadows[5],
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: 'auto',
  backgroundColor: theme.palette.grey[200], // 设置默认背景颜色
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  top: theme.spacing(3),
  fontSize: '3rem', // Increase icon size
}));

const DrawerList = styled(List)(({ theme }) => ({
  width: 250,
  marginTop: theme.spacing(8),
}));

const options = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'My Workspace', icon: <WorkIcon />, path: '/myworkspace' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { label: 'Logout', icon: <ExitToAppIcon />, path: '/logout' },
];

const TableCellTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem', // Adjust font size as needed
  fontWeight: 'bold', // Adjust font weight as needed
  textAlign: 'center',
}));

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const username = 'therajanmaurya'; // 直接设定用户名

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    axios.get(`http://127.0.0.1:5000/api/getuserprofile/${username}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        setError('Error fetching user profile');
        setLoading(false);
      });
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = (
    <DrawerList>
      {options.map((option) => (
        <ListItem button key={option.label} component={Link} to={option.path} onClick={toggleDrawer(false)}>
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.label} />
        </ListItem>
      ))}
    </DrawerList>
  );

  if (loading) return <div style={{ textAlign: 'center', marginTop: '20%' }}><CircularProgress /></div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '20%' }}>{error}</div>;

  return (
    <div>
      <GalleryHeader>
        <Typography variant="h2">User Profile</Typography>
        <MenuButton color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon fontSize="inherit" />
        </MenuButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </GalleryHeader>
      <Box display="flex" justifyContent="center" alignItems="center">
        <ProfileCard>
          <ProfileAvatar />
          <Typography variant="h6" gutterBottom>
            {user.name}
          </Typography>
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Username</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.username}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Office</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.office}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Status</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.status}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Language</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.language}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Primary Email</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Role</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.role}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold">Description</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{user.roleDescription}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </ProfileCard>
      </Box>
    </div>
  );
}
