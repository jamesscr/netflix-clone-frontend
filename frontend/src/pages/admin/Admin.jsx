import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import UserList from "../../components/userlist/UserList";
import MovieList from "../../components/movielist/MovieList";
import AdminDashboard from "../../components/admindashboard/AdminDashboard";
import "./admin.scss";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin">
      {sidebarOpen && <Sidebar />}
      <div className="admin-content">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="admin-main">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<MovieList />} />
            <Route path="users" element={<UserList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
