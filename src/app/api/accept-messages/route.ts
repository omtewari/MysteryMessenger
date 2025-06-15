import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User"; 
import { User } from "next-auth";

export async function POST(request:Request){
   await dbConnect()

   const session= await getServerSession(authOptions)
   const user:User = session?.user as User

   if(!session || !session.user){
    return Response.json(
        { success: false, 
        message:' not authenticated' },
        { status: 401 }
      );
   }

   const UserId = user._id;
   const {acceptMessages}=await request.json()

   try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        UserId,
        { isAcceptingMessage:acceptMessages },
        { new: true }
    )

    if(!updatedUser){
        return Response.json(
            { success: false,
                message:'failed to update user'},
                { status: 404 }
                );
    }
    return Response.json(
        { success: true,
            message:'message acceptance status updated',updatedUser},

            { status: 200 }
            );
   } catch (error) {
    console.log("failed to update user status")
    return Response.json(
        { success: false, 
        message:' failed to update user status' },
        { status: 500 }
      );
   }
}

export async function GET(request:Request){
    await dbConnect()
    

    const session= await getServerSession(authOptions)
    const user:User = session?.user as User
 
    if(!session || !session.user){
     return Response.json(
         { success: false, 
         message:' not authenticated' },
         { status: 401 }
       );
    }
 
    const UserId = user._id;
   

  try {
    const foundUser=await UserModel.findById(UserId)
     if(!foundUser){
      return Response.json(
          { success: false,
              message:'failed to found user'},
              { status: 404 }
              );
  }
  
  return Response.json(
      { success: true,
         isAcceptingMessages:foundUser.isAcceptingMessage
      },
          { status: 200 }
          );
  
  } catch (error) {
    console.log("error in getting message acceptnce status")
    return Response.json(
        { success: false, 
        message:' error in getting message acceptnce status' },
        { status: 500 }
      );
  }
}
