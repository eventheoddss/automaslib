import { db } from "@/lib/db";
import { Book, Profile, Message, Bookmark, Category } from "@prisma/client";

interface CategoryData {
  name: string;
  totalCategoryBooks: number;
  totalCategoryReviews: number;
  totalCategoryBookmarks: number;
  
}

interface AnalyticsData {
  categoriesData: CategoryData[];
}

export const getCategoryAnalytics = async (userId: string): Promise<AnalyticsData> => {
  try {

    const categories = await db.category.findMany();

    const categoriesData: CategoryData[] = [];

    for (const category of categories) {
      const totalCategoryBooks = await db.book.count({
        where: {
            categoryId: { equals: category.id },
        },
      });

      const totalCategoryReviews = await db.message.count({ 
        where: {
          book: { categoryId: { equals: category.id } },
        },
      });

      const totalCategoryBookmarks = await db.bookmark.count({
        where: {
           book: { categoryId: { equals: category.id }} ,
        },
      });

      categoriesData.push({
        name: category.name,
        totalCategoryBooks,
        totalCategoryReviews,
        totalCategoryBookmarks,
      });
    }

    return { categoriesData };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      categoriesData: [],
    };
  }
};
