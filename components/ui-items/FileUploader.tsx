"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadImage } from "@/lib/actions";
import { ImageType } from "@/lib/types/file.types";
import Image from "next/image";
import { downloadImage } from "@/lib/functions";

interface FileUploaderProps {
  setImage: Dispatch<SetStateAction<ImageType>>;
  image: ImageType;
  type: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  setImage,
  image,
  type,
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
      setMessage("При загрузке файла произошла ошибка.");
      console.log(error);
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
  
      // Reset file input value to allow the same file to be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      <div
        onClick={handleButtonClick}
        className={`w-full bg-blue-500 flex p-2 cursor-pointer items-center justify-center text-white rounded-md hover:bg-blue-400 ${uploading ? "opacity-40" : ""}`}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Загрузка..." : "Выберите файл и загрузите"}
      </div>
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
      <div className={image?.file && image?.id ? "" : "hidden"}>
      {image?.file &&
      ["png", "jpg", "webp"].includes(
        image?.file.split(".").pop() as string
      ) ? (
        <div
          className={`relative group rounded-md flex items-center overflow-hidden`}
        >
          <X
            className="absolute right-2 top-2 text-red-500 group-hover:z-[2] z-[-1] text-[24px] cursor-pointer"
            onClick={() => setImage({ id: "", file: "" })}
          />
          <Download
            className="absolute right-2 bottom-2 text-white group-hover:z-[2] z-[-1] text-[24px] cursor-pointer"
            onClick={() => downloadImage(image?.file, "Image")}
          />
          <Image
            width={1000}
            height={500}
            src={image?.file}
            alt="Uploaded Preview"
            className={`object-cover aspect_16_9 group-hover:brightness-50 ease-linear duration-200`}
          />
        </div>
      ) : image?.file ? (
        <div className="border p-2 border-gray-300 rounded-md relative">
          <X
            className="absolute right-2 top-2 text-red-500 text-[24px] cursor-pointer"
            onClick={() => setImage({ id: "", file: "" })}
          />
          <p
            className="overflow-hidden line-clamp-1"
            title={decodeURIComponent(image?.file?.split("/")[5])}
          >
            {image?.file &&
              decodeURIComponent(image.file.split("/")[5])
                .split(/[-_]/)
                .join(" ")}
          </p>
        </div>
      ) : (
        ""
      )}
      </div>
    </div>
  );
};
