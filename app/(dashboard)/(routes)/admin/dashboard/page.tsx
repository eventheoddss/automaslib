import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getCategoryAnalytics } from "@/actions/get-category-analytics";
import { getTotalsAnalytics } from "@/actions/get-totals-analytics";

import { DataCard } from "./_components/data-card";
import CustomChart from "./_components/chart";

const AdminDashboard = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { categoriesData } = await getCategoryAnalytics(userId);

  const { totalBooks, totalUsers, totalMessages, totalBookmarks } = await getTotalsAnalytics();

  const totals = [
      { name: "Books", total: totalBooks },
      { name: "Users", total: totalUsers },
      { name: "Messages", total: totalMessages },
      { name: "Bookmarks", total: totalBookmarks },
  ];

  const data = categoriesData.map(category => ({
    category: category.name,
    totals: [category.totalCategoryBooks, category.totalCategoryReviews, category.totalCategoryBookmarks],
  }));


  return (
    <section className="p-6">
      <h1 className="font-semibold text-xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <DataCard label="Total Books" value={totalBooks} />
        <DataCard label="Total Users" value={totalUsers} />
        <DataCard label="Total Reviews" value={totalMessages} />
        <DataCard label="Total Bookmarks" value={totalBookmarks} />
      </div>

      <>
        <h2 className="font-semibold mb-2 text-lg">Section Analytics</h2>
        <CustomChart data={data} chartType="bar" />
      </>

    </section>
  );
};

export default AdminDashboard;
