import client from "./client";

export const addMovie = async (videoInfo) => {
  try {
    const { data } = await client.post("/videoRouter/add", videoInfo);
    return data;
  } catch (error) {
    console.error("Error in adding:", error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const { data } = await client.get("/videoRouter/video/" + id);
    return data;
  } catch (error) {
    console.error("Error in getting video:", error);
    throw error;
  }
};

export const getAllVideos = async () => {
  try {
    const { data } = await client.get("/videoRouter/videos");
    return data;
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    throw error;
  }
};

export const updateVideo = async (id, videoInfo) => {
  try {
    const { data } = await client.patch("/videoRouter/video/" + id, videoInfo);
    return data;
  } catch (error) {
    console.error("Error in updating:", error);
    throw error;
  }
};

export const deleteVideo = async (id) => {
  try {
    const { data } = await client.delete(`/videoRouter/video/${id}`);
    return data;
  } catch (error) {
    console.error("Error in deleting:", error);
    throw error;
  }
};

const validateVideoInfo = (videoInfo) => {
  const { title, description, releaseDate, genre, duration } = videoInfo;

  if (!title.trim()) return { ok: false, error: "Title is missing!" };
  if (title.length < 3)
    return { ok: false, error: "Title must be at least 3 characters long!" };

  if (!description.trim())
    return { ok: false, error: "Description is missing!" };
  if (description.length < 10)
    return {
      ok: false,
      error: "Description must be at least 10 characters long!",
    };

  if (!releaseDate) return { ok: false, error: "Release date is missing!" };
  if (isNaN(Date.parse(releaseDate)))
    return { ok: false, error: "Invalid release date!" };

  if (!genre.trim()) return { ok: false, error: "Genre is missing!" };

  if (!duration) return { ok: false, error: "Duration is missing!" };
  if (isNaN(duration) || duration <= 0)
    return { ok: false, error: "Invalid duration!" };

  return { ok: true };
};
