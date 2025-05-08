import client from "./client";

export const createUser = async (userInfo) => {
  try {
    const { data } = await client.post("/auth/signUp", userInfo);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await client.get("/auth/users");
    return data;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

export const signInUser = async (userInfo) => {
  try {
    const { data } = await client.post("/auth/login", userInfo);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
export const updatePassword = async (email, currentPassword, newPassword) => {
  try {
    const { data } = await client.patch("/auth/updatePassword", {
      email,
      currentPassword,
      newPassword,
    });
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

// passer le token en header
export const deleteAccount = async (password) => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const { data } = await client.delete("/auth/deleteAccount", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { password },
    });
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const getUserById = async (id) => {
  try {
    const { data } = await client.get("/auth/user/:id", id);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const getIsAuth = async (token) => {
  try {
    const { data } = await client.get("/auth/user/is-auth", {
      headers: {
        Authorization: "Bearer " + token,
        accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

// Pour l'admin
export const updateUser = async (userId, userData, token) => {
  try {
    const { data } = await client.put(`/auth/user/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Error in updating user:", error);
    throw error;
  }
};
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    await client.delete(`/auth/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in deleting user:", error);
    throw error;
  }
};

// export const verifyPasswordResetToken = async (token, userId) => {
//   try {
//     const { data } = await client.post("/auth/", {
//       token,
//       userId,
//     });
//     return data;
//   } catch (error) {
//     const { response } = error;
//     if (response?.data) return response.data;

//     return { error: error.message || error };
//   }
// };

// export const resetPassword = async (passwordInfo) => {
//   try {
//     const { data } = await client.post("/auth/", passwordInfo);
//     return data;
//   } catch (error) {
//     const { response } = error;
//     if (response?.data) return response.data;

//     return { error: error.message || error };
//   }
// };

// export const resendEmailVerificationToken = async (userId) => {
//   try {
//     const { data } = await client.post("/auth/", {
//       userId,
//     });
//     return data;
//   } catch (error) {
//     const { response } = error;
//     if (response?.data) return response.data;

//     return { error: error.message || error };
//   }
// };

// export const verifyUserEmail = async (userInfo) => {
//   try {
//     const { data } = await client.post("/auth/verify-email", userInfo);
//     return data;
//   } catch (error) {
//     const { response } = error;
//     if (response?.data) return response.data;

//     return { error: error.message || error };
//   }
// };
