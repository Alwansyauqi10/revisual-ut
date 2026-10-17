
import fs from "node:fs";
import path from "node:path";

const uploadDirectory = path.resolve(
  process.env.PHOTO_STORAGE_DIR ||
    path.join(process.cwd(), "uploads", "photos"),
);

export const ensurePhotoStorageDirectory = () => {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
};

export const getPhotoStorageDirectory = () => {
  ensurePhotoStorageDirectory();
  return uploadDirectory;
};

export const deletePhotoFile = (
  photoKey: string | null | undefined,
) => {
  if (!photoKey) {
    return;
  }

  const filename = path.basename(photoKey);
  const filePath = path.join(
    getPhotoStorageDirectory(),
    filename,
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted photo: ${filePath}`);
    }
  } catch (error) {
    console.error(
      `Failed to delete photo: ${filePath}`,
      error,
    );
  }
};
