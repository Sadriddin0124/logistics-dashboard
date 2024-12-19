"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadImage } from "@/lib/actions";
import { ImageType } from "@/lib/types/file.types";
import Image from "next/image";

interface FileUploaderProps {
  setImage: Dispatch<SetStateAction<ImageType>>;
  image: ImageType;
  type: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  setImage,
  image,
  type
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const result = await uploadImage(formData);
      setMessage(result.message);
      console.log(result);
      setImage({ id: result?.id, file: result?.file });

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
      console.log(error);
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={type}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <Button onClick={handleButtonClick} disabled={uploading} className="w-full bg-blue-500 hover:bg-blue-400">
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Choose File & Upload"}
      </Button>
      {(uploading || uploadProgress > 0) && (
        <Progress value={uploadProgress} className="w-full" />
      )}
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      {image?.file && ["png", "jpg", "webp"].includes(image?.file.split(".").pop() as string) &&  <div
        className={`relative group rounded-md flex items-center overflow-hidden`}
      >
        <X
          className="absolute right-2 top-2 text-red-500 group-hover:z-[2] z-[-1] text-[24px] cursor-pointer"
          onClick={() => setImage({ id: "", file: "" })}
        />
        <Image
          width={1000}
          height={500}
          src={image?.file}
          alt="Uploaded Preview"
          className={`object-cover group-hover:brightness-50 ease-linear duration-200`}
        />
      </div>}
    </div>
  );
};
