import fs from "node:fs";
import path from "node:path";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads/photos",
);

export const deletePhotoFile = (
  photoKey: string | null | undefined,
) => {
  if (!photoKey) {
    return;
  }

  const filename = path.basename(photoKey);

  const filePath = path.join(
    uploadDirectory,
    filename,
  );

  if (!filePath.startsWith(uploadDirectory)) {
    console.warn(
      `Blocked invalid photo path: ${photoKey}`,
    );

    return;
  }

  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted photo: ${filePath}`);
  } catch (error) {
    console.error(
      `Failed to delete photo: ${filePath}`,
      error,
    );
  }
};