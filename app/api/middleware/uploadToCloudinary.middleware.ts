// import { uploadOnCloudinary } from "../api/cloudinary";

import { uploadOnCloudinary } from '../cloudinary';

interface ExtendedRequest {
  file: {
    path: string;
  };
  cloudinary?: {
    url: string;
    publicId: string;
  };
}

interface Response {
  status: (code: number) => {
    json: (data: { message: string }) => void;
  };
}

interface NextFunction {
  (error?: Error | string | undefined): void;
}

export const uploadToCloudinary = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next();

    const result = await uploadOnCloudinary(req.file.path);

    if (!result) {
      return res.status(500).json({ message: 'Upload failed' });
    }

    req.cloudinary = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    next();
  } catch (error) {
    next(error instanceof Error ? error : String(error));
  }
};
