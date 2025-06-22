import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// This variable name always will be handler
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}