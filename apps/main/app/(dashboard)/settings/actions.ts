"use server";

import client from "@/lib/axios-client";
import { z } from "zod";

export async function getUserProfile() {
  try {
    console.log("Fetching user profile...");
    
    // First, get the current user's ID from the session
    const authResponse = await client.get("/auth/me");
    const userId = authResponse.data?.id;
    
    if (!userId) {
      throw new Error("User not authenticated or user ID not found");
    }
    
    // Then fetch the user's profile using their ID
    const response = await client.get(`/api/v1/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("API Response:", response.data);

    // If the API returns the user object directly
    const userData = response.data?.data || response.data;
    
    if (!userData) {
      console.warn("No user data found in the response");
      return { 
        user: null, 
        error: "No user data available" 
      };
    }

    console.log("Using user data:", userData);

    return { 
      user: {
        id: userData.id || "",
        firstName: userData.first_name || userData.firstName || "",
        lastName: userData.last_name || userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        businessName: userData.business_name || userData.businessName || userData.company || "",
        isActive: userData.is_active !== false && userData.isActive !== false,
        isBanned: userData.is_banned === true || userData.isBanned === true,
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error("Error in getUserProfile:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return { 
      user: null, 
      error: error.response?.data?.message || error.message || "Failed to fetch user profile" 
    };
  }
}