import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Notifications, Settings } from '@mui/icons-material';
import './topbar.scss';

const Topbar = ({ toggleSidebar }) => {
  return (
    <AppBar position="static" className="topbar">
      <Toolbar>
        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className="title">
          Admin Dashboard
        </Typography>
        <div className="icons">
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;