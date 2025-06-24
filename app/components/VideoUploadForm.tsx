'use client';
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import { apiClient } from "@/lib/api-client";
interface VideoFormData {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
}

function VideoUploadForm() {
    const [formData, setFormData] = useState<Partial<VideoFormData>>({});
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleVideoSuccess = (res: any) => {
        setFormData(prev => ({ ...prev, videoUrl: res.url }));
        setVideoUploadProgress(100);
    };

    const handleThumbnailSuccess = (res: any) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: res.url }));
        setThumbnailUploadProgress(100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Later, we will send this data to our API
        console.log("Submitting:", formData);
        const res = await apiClient.createVideos(formData as VideoFormData);
        console.log("Video uploaded successfully", res);
        
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    id="description"
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Video</label>
                <FileUpload
                    fileType="video"
                    onSuccess={handleVideoSuccess}
                    onProgress={setVideoUploadProgress}
                />
                {videoUploadProgress > 0 && videoUploadProgress <= 100 && (
                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${videoUploadProgress}%` }}></div>
                    </div>
                )}
                {formData.videoUrl && <div className="text-green-600">Video uploaded successfully!</div>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                <FileUpload
                    fileType="image"
                    onSuccess={handleThumbnailSuccess}
                    onProgress={setThumbnailUploadProgress}
                />
                 {thumbnailUploadProgress > 0 && thumbnailUploadProgress <= 100 && (
                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${thumbnailUploadProgress}%` }}></div>
                    </div>
                )}
                {formData.thumbnailUrl && <div className="text-green-600">Thumbnail uploaded successfully!</div>}
            </div>
            
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                disabled={!formData.videoUrl || !formData.thumbnailUrl || !formData.title || !formData.description}
            >
                Submit Video
            </button>
        </form>
    );
}

export default VideoUploadForm;