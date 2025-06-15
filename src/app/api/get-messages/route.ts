import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();

  // Get session (make sure to pass req, res properly if needed in your setup)
  const session = await getServerSession(authOptions);

  // Log session info
  console.log('Session:', session);

  const _user: User | undefined = session?.user;

  if (!session || !_user) {
    console.log('User not authenticated or session missing');
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log('User ID from session:', _user._id);

  let userId: mongoose.Types.ObjectId;
  try {
    userId = new mongoose.Types.ObjectId(_user._id);
  } catch (e) {
    console.error('Invalid user ID:', _user._id);
    return Response.json(
      { success: false, message: 'Invalid user ID' },
      { status: 400 }
    );
  }

  // Check if user exists in DB
  const userExists = await UserModel.findById(userId);
  console.log('User exists in DB:', userExists);

  if (!userExists) {
    return Response.json(
      { message: 'User not found', success: false },
      { status: 404 }
    );
  }

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      // preserve null and empty arrays so user doc won't disappear if no messages
      { $unwind: { path: '$message', preserveNullAndEmptyArrays: true } },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: '$_id', message: { $push: '$message' } } },
    ]).exec();

    console.log('Aggregation result:', user);

    if (!user || user.length === 0) {
  return Response.json(
    { message: 'User not found in aggregation', success: false },
    { status: 404 }
  );
}

const messages = Array.isArray(user[0].message) ? user[0].message : [];

const filteredMessages = messages.filter(Boolean);

return Response.json(
  { messages: filteredMessages },
  { status: 200 }
  
);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}