const Video = require("../models/Video");
const User = require("../models/User");

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestVideos = async (req, res) => {
  const { limit = 5 } = req.query;

  const results = await Video.find().sort("-createdAt").limit(parseInt(limit));

  const videos = results.map((m) => {
    return {
      id: m._id,
      title: m.title,
      description: m.description,
      url: m.url,
    };
  });
  res.json({ videos });
};

exports.addVideo = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      user: req.body.user,
    });

    // updating review for movie.
    user.videos.push(video._id);
    await user.save();

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Vidéo non trouvée" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Vidéo MAJ avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findOne({ _id: videoId, user: userId });
    if (!video) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas l'auteur de cette vidéo!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.videos = user.videos.filter((rId) => rId.toString() !== videoId);
    await Video.findByIdAndDelete(videoId);
    await user.save();

    res.status(200).json({ message: "Vidéo supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId).populate(
      "user",
      "username email"
    );

    if (!video) {
      return res.status(404).json({ message: "Vidéo non trouvée" });
    }
    res.status(200).json({ video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
