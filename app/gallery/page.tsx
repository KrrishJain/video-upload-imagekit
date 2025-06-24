'use client'
import { useEffect, useState } from "react";
import VideoFeed from "../components/VideoFeed";
import { IVideo } from "@/models/Video.model";
import { apiClient } from "@/lib/api-client";

export default function GalleryPage() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      console.log("fucntion called");
      
      const res: any = await apiClient.getVideos()
      console.log(res);
      
      setVideos(res)
    }
    fetchVideos();
  }, []);

  

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Uploaded Videos</h1>
      <VideoFeed videos={videos} />
    </div>
  );
} 