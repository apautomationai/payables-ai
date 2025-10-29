import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, "DELETE");
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Get the backend API URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    // Get cookies from the incoming request headers
    const cookieHeader = request.headers.get("cookie") || "";

    // Get query parameters from the incoming request
    const url = new URL(request.url);
    const queryString = url.search;

    // Prepare headers for the backend request
    const headers: Record<string, string> = {
      "Content-Type": request.headers.get("content-type") || "application/json",
    };

    // Add cookie header if cookies exist
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    // Forward authorization header if it exists
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Forward the request to the backend
    const backendResponse = await fetch(
      `${backendUrl}/api/v1/google/callback${queryString}`,
      {
        method,
        headers,
        body: method !== "GET" && method !== "DELETE" ? await request.text() : undefined,
      }
    );

    // if got 200 response then redirect to /integrations page
    if (backendResponse.status === 200) {
      return NextResponse.redirect(new URL("/integrations", request.url));
    } else {
      return NextResponse.json(await backendResponse.json(), {
        status: backendResponse.status,
      });
    }
  } catch (error) {
    console.error("Error forwarding request to backend:", error);
    return NextResponse.json(
      { error: "Failed to forward request" },
      { status: 500 }
    );
  }
}

