
import { db } from '@/lib/db';

export const isAdmin = async (userId?: string | null): Promise<boolean> => {
  if (!userId) {
    return false; 
  }

  try {
    const user = await db.profile.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true, 
      },
    });

    return user?.role === 'ADMIN' || false;
  } catch (error) {
    console.error('[isAdmin]', error);
    return false;
  }
};

export const isUser = async (userId?: string | null): Promise<boolean> => {
    if (!userId) {
      return false; 
    }
  
    try {
      const user = await db.profile.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true, 
        },
      });
  
      return user?.role === 'USER' || false;
    } catch (error) {
      console.error('[isUser]', error);
      return false;
    }
  };