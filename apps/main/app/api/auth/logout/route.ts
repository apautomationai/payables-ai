import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear authentication cookies
        cookieStore.delete("token");
        cookieStore.delete("userId");

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, message: "Logout failed" },
            { status: 500 }
        );
    }
}
