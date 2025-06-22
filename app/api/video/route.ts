import { IVideo } from './../../../models/Video.model';
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video from "@/models/Video.model";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDB()
        const videos = await Video.find({}).sort({createdAt: -1}).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], {status:200})
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch videos"},
            {status: 500}
        )
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                {error: "Unauthorised"},
                {status: 401}
            )
        }

        await connectToDB()
        const body: IVideo = await request.json()

        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl){
            return NextResponse.json(
                {error: "All fields are required "},
                {status: 401}
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData)

        return NextResponse.json(newVideo)
    } catch (error) {
        console.log("Error while creating video", error);
        return NextResponse.json(
                {error: "Failed to create video"},
                {status: 500}
            )
    }
}