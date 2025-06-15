import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUp";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: "Invalid query parameter",
                    errors: usernameErrors, // Include validation errors if needed
                },
                {
                    status: 400,
                }
            );
        }

        const { username } = result.data;

        // Check for existing verified user
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        // Username is available
        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500,
            }
        );
    }
}
