"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    try {
        const cookieStore = await cookies();

        // Clear authentication cookies
        cookieStore.delete("token");
        cookieStore.delete("userId");
        sessionStorage.removeItem('payment_canceled');

        // Redirect to sign-in page
        redirect("/sign-in");
    } catch (error: any) {
        // If redirect throws, re-throw it
        if (error.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("Logout error:", error);
        throw error;
    }
}
