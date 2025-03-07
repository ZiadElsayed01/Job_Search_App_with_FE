import { cloudinaryConfig } from "../Config/cloudinaryConfig.js";

export const upload = async (file, folder) => {
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    file.path,
    {
      folder: `${process.env.CLOUD_FOLDER}/${folder}`,
      resource_type: "auto",
    }
  );

  return { secure_url, public_id };
};

export const uploadMultiple = async (files, folder) => {
  const Images = [];
  for (const file of files) {
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder: `${process.env.CLOUD_FOLDER}/${folder}`,
        resource_type: "auto",
      }
    );
    Images.push({ secure_url, public_id });
  }

  return Images;
};
