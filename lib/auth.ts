import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
       CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {label: "Email", type: "text"},
            password: {label: "Password", type: "password"}
        },
        async authorize(credentials){
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing Email or password")
            }

            try {
                await connectToDB()
                const user = await User.findOne({email: credentials.email})
                
                if (!user) {
                    throw new Error("NO user found")
                }

                const isPasswordValidate =  await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValidate) {
                    throw new Error("Invalid Password")
                }

                return{
                    id: user._id.toString(),
                    email: user.email
                }
            } catch (error) {
                console.error("Auth error", error);
                throw error
            }
        }
       })
    ],
    callbacks: {
        async jwt({token, user}){
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if (token) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}