import { connectToDB } from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async  function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                {error: "Email and Password are required"},
                {status: 400}
            )
        }

        await connectToDB()
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return NextResponse.json(
                {error: "User already exist"},
                {status: 400}
            )
        }

        const user =  await User.create({
            email,
            password,
        })

        return NextResponse.json(
            {message: "User register successfully", user},
            {status: 201}
        )
    } catch (error) {
        console.error("Register Error", error);
        return NextResponse.json(
                {error: "Failed to Register User"},
                {status: 400}
            )
    }
}