import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)({
  background: 'transparent',
  boxShadow: 'none',
});

const ITEM_HEIGHT = 48;

const options = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'My Workspace', icon: <WorkIcon />, path: '/myworkspace' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { label: 'Logout', icon: <ExitToAppIcon />, path: '/logout' },
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gallery
        </Typography>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.label}
              component={Link}
              to={option.path}
              onClick={handleClose}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
}
