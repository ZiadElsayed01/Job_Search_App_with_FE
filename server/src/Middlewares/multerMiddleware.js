import multer from "multer";
import fs from "fs";
import path from "path";

// Local
export const multerLocal = (destinationPath = "Assets", extensions = []) => {
  const destinationFolder = `Assets/${destinationPath}`;

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const fileExt = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    if (extensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};

// Host
export const multerHost = (extensions = []) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    const fileExt = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    if (extensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};
