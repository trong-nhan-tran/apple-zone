import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export async function getUserProfile(userId: string) {
  // Lấy thông tin user từ Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
  
  if (authError || !authUser) {
    throw new Error('User not found');
  }
  
//   // Lấy thông tin profile từ Prisma
//   const userProfile = await prisma.user.findUnique({
//     where: { auth_id: userId },
//     // include: {
//     //   orders: true
//     // }
//   });
  
//   return {
//     auth: authUser,
//     profile: userProfile
//   };
} 