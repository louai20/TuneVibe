import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, spotifyId, images, jsonData } = body;

        if (!name || !spotifyId || !jsonData) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        // const image = images[2].url

        const existingPlaylist = await prisma.userSavedPlaylist.findUnique({
            where: {
                userId_spotifyId: {
                    userId: user.id,
                    spotifyId: spotifyId,
                },
            },
        });

        if (existingPlaylist) {
            return NextResponse.json(
                { message: "Playlist already exists." },
                { status: 409 }
            );
        }

        const savedPlaylist = await prisma.userSavedPlaylist.create({
            data: {
                name,
                spotifyId,
                // image,
                jsonData,
                user: {
                    connect: { id: user.id },
                },
            },
        });

        return NextResponse.json(savedPlaylist, { status: 201 });
    } catch (error) {
        console.error("Error saving playlist:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// export async function GET(request: Request) {
//     try {
//         const session = await getServerSession(authOptions);
//         if (!session || !session.user?.email) {
//             return NextResponse.json(
//                 { message: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         const user = await prisma.user.findUnique({
//             where: { email: session.user.email },
//             include: { savedPlaylists: true },
//         });

//         if (!user) {
//             return NextResponse.json(
//                 { message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(user.savedPlaylists, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching playlists:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { savedPlaylists: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const profileData = {
            name: user.name,
            email: user.email,
            //   avatarUrl: user.avatarUrl || null,
            savedPlaylists: user.savedPlaylists.map((playlist: any) => ({
                id: playlist.id,
                name: playlist.name,
                spotifyId: playlist.spotifyId,
                jsonData: playlist.jsonData,
                createdAt: playlist.createdAt,
                updatedAt: playlist.updatedAt,
            })),
        };

        return NextResponse.json(profileData, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        console.warn("Unauthorized access attempt.");
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
  
      if (!user) {
        console.warn("User not found.");
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      const body: { spotifyId: string } = await request.json();
      const { spotifyId } = body;
  
      if (!spotifyId) {
        console.warn("Missing spotifyId in DELETE request.");
        return NextResponse.json(
          { message: "Missing spotifyId." },
          { status: 400 }
        );
      }
  
      const existingPlaylist = await prisma.userSavedPlaylist.findUnique({
        where: {
          userId_spotifyId: {
            userId: user.id,
            spotifyId: spotifyId,
          },
        },
      });
  
      if (!existingPlaylist) {
        console.warn("Playlist not found:", spotifyId);
        return NextResponse.json(
          { message: "Playlist not found." },
          { status: 404 }
        );
      }
  
      await prisma.userSavedPlaylist.delete({
        where: {
          userId_spotifyId: {
            userId: user.id,
            spotifyId: spotifyId,
          },
        },
      });
  
      console.log("Playlist deleted successfully:", spotifyId);
  
      return NextResponse.json(
        { message: "Playlist deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting playlist:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
