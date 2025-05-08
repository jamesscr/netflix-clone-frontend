import React, { useState } from "react";
import "./sidebar.scss";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Home,
  VideoLibrary,
  VideoCall,
  History,
  AccountCircle,
  ExitToApp,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import AddVideoModal from "../modals/videomodals/addvideomodal/AddVideoModal";

const Sidebar = () => {
  const [open, setOpen] = useState(true); // For drawer
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  return (
    <>
      <Drawer
        className="sidebar"
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div className="sidebar-content">
          <List>
            <ListItem>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/admin/users">
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/admin/movies">
                <ListItemIcon>
                  <VideoLibrary />
                </ListItemIcon>
                <ListItemText primary="Movies" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemButton onClick={handleModalOpen}>
                <ListItemIcon>
                  <VideoCall />
                </ListItemIcon>
                <ListItemText primary="Add Video" />
              </ListItemButton>
            </ListItem>
          </List>
          <List className="logout-button">
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <AddVideoModal open={modalOpen} handleClose={handleModalClose} />
    </>
  );
};

export default Sidebar;
