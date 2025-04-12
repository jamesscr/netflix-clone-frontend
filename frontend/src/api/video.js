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
    const { data } = await client.delete("/videoRouter/video/" + id);
    return data;
  } catch (error) {
    console.error("Error in delrting:", error);
    throw error;
  }
};
