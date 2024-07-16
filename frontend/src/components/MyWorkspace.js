import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  styled,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

export default function MyWorkspace() {
  const [images, setImages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    axios.get('http://127.0.0.1:5000/api/images')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
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

  const handleDelete = (dbName) => {
    axios.delete(`http://127.0.0.1:5000/api/delete/database/${dbName}`)
      .then(response => {
        console.log(response.data.message);
        fetchImages();  // Refresh the image list
      })
      .catch(error => {
        console.error('Error deleting database:', error);
      });
  };

  return (
    <div>
      <GalleryHeader>
        <Typography variant="h2">My Workspace</Typography>
        <MenuButton color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon fontSize="inherit" />
        </MenuButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </GalleryHeader>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <TableCellTypography>Image</TableCellTypography>
              </TableCell>
              <TableCell align="center">
                <TableCellTypography>Title</TableCellTypography>
              </TableCell>
              <TableCell align="center">
                <TableCellTypography>Author</TableCellTypography>
              </TableCell>
              <TableCell align="center">
                <TableCellTypography>Actions</TableCellTypography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <img src={`data:image/png;base64,${item.img}`} alt={item.title} width="250" height="150" />
                </TableCell>
                <TableCell align="center">{item.title}</TableCell>
                <TableCell align="center">{item.author}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDelete(item.databasename)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
