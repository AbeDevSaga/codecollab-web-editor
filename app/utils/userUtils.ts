import { TUser } from "../types/type";

 export const formatChatMembers = (participants: {
  user: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
  role: string;
  status: string;
}[]): TUser[] => {
  return participants.map((participant) => ({
    _id: participant.user._id,
    username: participant.user.username,
    email: participant.user.email,
    role: participant.role,
    profileImage: participant.user.profileImage,
    status: participant.status as "active" | "inactive" | "banned" | "pending" | undefined,
  }));
};
