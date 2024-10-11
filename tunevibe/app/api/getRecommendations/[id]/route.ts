import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: {id: string}}
) {
    try {
        const qParams = params.id;

        // Get Access Token
        const tokenParams = new URLSearchParams();
        tokenParams.append("grant_type", "client_credentials");
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            tokenParams.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
                },
            }
        );
        const accessToken = tokenResponse.data.access_token;

        const recommendationsResponse = await axios.get(
            `https://api.spotify.com/v1/recommendations?${qParams}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return NextResponse.json(recommendationsResponse.data);

    } catch (error: any) {
        console.error(
            "Error fetching data:",
            error.response?.data || error
        );
        return NextResponse.json(
            { error: error.response?.data?.error?.message || "Failed to fetch data" },
            { status: error.response?.status || 500 }
        );
    }
}