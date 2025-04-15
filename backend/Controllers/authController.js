const User = require("../models/User");
const Video = require("../models/Video");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(400).send({ error: "Tous les champs sont requis" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res.status(400).send({ error: "Email déjà utilisé" });
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(400).send({
      error: err.message,
      message: "Erreur lors de la création de l'utilisateur",
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send({
      err: error.message,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvée" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).send({
      err: error.message,
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).send({ error: "Utilisateur non trouvé!" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ error: "Mot de passe incorrect" });
    }
    const { _id, isVerified, role } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    res.json({
      user: { id: _id, email, token: jwtToken, isVerified, role },
    });
  } catch (err) {
    res
      .status(400)
      .send({ error: err.message, message: "Erreur lors de la connexion" });
  }
};
exports.updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).send({ error: "Mot de passe actuel incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).send({ error: "Erreur interne du serveur." });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authorizationHeader.replace("Bearer ", "");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ error: "Token invalide" });
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (!req.body.password) {
      return res.status(400).json({
        error: "Le mot de passe est requis pour supprimer le compte.",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }

    // Delete associated videos
    await Video.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "Compte et vidéos associées supprimés avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du compte." });
  }
};
exports.isAuthenticated = async (req, res) => {
  try {
    const { user } = req;
    const authUser = await User.findById(user);
    if (!authUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    res.json({
      user: {
        id: authUser.id,
        email: authUser.email,
        isVerified: authUser.isVerified,
        role: authUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(403).json({ message: "Unauthorized" });
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ updatedUser, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
