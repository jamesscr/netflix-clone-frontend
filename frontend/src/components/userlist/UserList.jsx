import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { getAllUsers, updateUser, deleteUser, getIsAuth } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import "./userlist.scss";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateNotification } = useNotification();

  const { authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveEdit = async (editedUser) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      // update the user
      const updatedUser = await updateUser(editedUser._id, editedUser, token);

      // Update local state
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );

      handleCloseEditModal();
      // refresh
      fetchUsers();
      updateNotification("success", "User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle the error (e.g., show an error message to the user)
      // You might want to use a notification system here
      updateNotification("error", "Failed to update user. Please try again.");
    }
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDelete = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is undefined");
      }

      // delete the user
      await deleteUser(userId);

      // Update local state
      setUsers(users.filter((user) => user._id !== userId));

      handleCloseDeleteModal();
      // refresh
      fetchUsers();

      // notification
      updateNotification("success", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      // notification
      updateNotification("error", `Failed to delete user: ${error.message}`);
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Verifier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isVerified ? "OUI" : "NON"}
                      color={user.isVerified ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleOpenEditModal(user)}
                    >
                      {/* icon edit */}
                      <EditIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteModal(user)}
                    >
                      {/* icon delete */}
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <EditUserModal
        user={selectedUser}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        handleSave={handleSaveEdit}
      />
      <DeleteUserModal
        user={selectedUser}
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default UserList;
