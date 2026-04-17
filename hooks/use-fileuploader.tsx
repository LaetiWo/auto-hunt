"use client";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "./use-toast";
import axios, { AxiosProgressEvent } from "axios";

interface UseFileUploaderProps {
  uploadApiEndpoint: string;
  onFileUrlsReceived: (fileUrls: string[]) => void;
}

interface UseFileUploaderResult {
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  isDragActive: ReturnType<typeof useDropzone>["isDragActive"];
  files: File[];
  uploading: boolean;
  uploadProgress: number;

  fileRejections: ReturnType<typeof useDropzone>["fileRejections"];
}

const useFileUploader = ({
  uploadApiEndpoint,
  onFileUrlsReceived,
}: UseFileUploaderProps): UseFileUploaderResult => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadingProgress] = useState<number>(0);
  const uploadFilesToApi = useCallback(async (filesToUpload: File[]) => {
    setUploading(true);
    setUploadingProgress(0);
    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(uploadApiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadingProgress(progress);
        },
      });

      if (response.status !== 200) {
        toast({
          title: "Upload failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
      const fileUrls = response.data?.files.map((file: any) => file.url);
      if (!fileUrls || !Array.isArray(fileUrls)) {
        toast({
          title: "Upload failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
      console.log(fileUrls, fileUrls);
      onFileUrlsReceived(fileUrls);
      setFiles([]);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      if (rejectedFiles.length > 0) {
        toast({
          title: "File type not accepted",
          description: "Please upload valid image files only.",
          variant: "destructive",
        });

        return;
      }
      await uploadFilesToApi(acceptedFiles);
    },
    [uploadFilesToApi],
  );
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      },
      maxFiles: 7,
      maxSize: 10 * 1024 * 1024,
    });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    files,
    uploading,
    uploadProgress,
  };
};

export default useFileUploader;
