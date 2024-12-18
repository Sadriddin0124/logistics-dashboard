"use client";

import {
  useMutation,
} from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/actions";
import { useState } from "react";


export default function ImageUploader({ setImageId, title, format }: {setImageId: (id: string, title: string)=> void, title: string, format: string}) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      console.log(data);
      
      setImageId(data?.id, title);
      setImageUrl(data?.file);
      setLoading(false)
      // getId(data?.id)
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });
  const maxFileSize1 = 5 * 1024 * 1024; // 5 MB in bytes
  const maxFileSize2 = 2 * 1024 * 1024; // 5 MB in bytes
  const maxFileSize = title === "category" ? maxFileSize2 : maxFileSize1
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] as Blob;
    if (file) {
      if (file.size > maxFileSize) {
        setErrorMessage(title === "category" ? "Fayl hajmi 2 MB dan katta bo'lmasligi kerak!" : "Fayl hajmi 5 MB dan katta bo'lmasligi kerak!");
      } else {
        setErrorMessage('');
        console.log(`File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        const formData = new FormData();
        formData.append("file", file);
        uploadMutation.mutate(formData);
        setLoading(true)
        // Proceed with the file upload logic
      }
    }
  };
  const removeImage = () => {
    setLoading(false)
    setImageUrl("")
    setImageId("", "")
  }
  return (
        <div className="w-full h-full cursor-pointer flex-col flex items-center">
          {!imageUrl && !loading && <div className="text-[#404B7C] cursor-pointer border-[#404B7C] border-2 border-dashed py-1 w-full h-full flex flex-col relative items-center justify-center rounded-md gap-2">
            <Input
              id="image"
              onChange={handleFileChange}
              className="col-span-3 relative z-[2] cursor-pointer opacity-0 w-full h-full"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              disabled={imageUrl ? true : false}
            />
            <span className="absolute z-[1]">Rasm yuklash</span>
          {errorMessage && <p className="text-red-500 p-3">{errorMessage}</p>}
          </div>}
          {!imageUrl && !loading && <p className="text-red-500 text-center mt-1">Rasmni {format} formatda yuklang</p>}
          {imageUrl && !loading && (
            <div className={`${title === "elon" ? "h-[200px]" : title === "category" ? "category-container" : "image-container"} relative group rounded-md flex items-center overflow-hidden`}>
              <X
                className="absolute right-2 top-2 text-red-500 group-hover:z-[2] z-[-1] text-[24px] cursor-pointer"
                onClick={removeImage}
              />
              <Image
                width={1000}
                height={500}
                src={imageUrl}
                alt="Uploaded Preview"
                className={`object-cover group-hover:brightness-50 ease-linear duration-200 ${title === "category" ? "category-container" : ""}`}
              />
            </div>
          )}
          { loading && <div className="w-full h-[200px] flex justify-center items-center flex-col">
                <Loader2 className={`animate-spin text-gray-400  w-12 h-12`} />
                <span>Rasm yuklanmoqda</span>
            </div>}
        </div>
  );
}
