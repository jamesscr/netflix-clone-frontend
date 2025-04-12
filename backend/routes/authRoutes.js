const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const { isAuth, isAdmin } = require("../middleware/VerifyToken");

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.patch("/updatePassword", authController.updatePassword);
router.delete("/deleteAccount", authController.deleteAccount);
router.get("/user/is-auth", isAuth, authController.isAuthenticated);
router.get("/users", authController.getAllUsers);
router.get("/user/:id", authController.getUserById);

// Admin routes
router.put("/user/:id", isAuth, authController.updateUser);
router.delete("/user/:id", isAuth, authController.deleteUser);

module.exports = router;
