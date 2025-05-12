import { PORTAL_PATHS } from "@/constants/path";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerStoresPage() {
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Retrieve the list of stores associated with the authenticated user.
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  // If the user has no stores, redirect them to the page for creating a new store.
  if (stores.length === 0) {
    redirect(PORTAL_PATHS.CREATE_SELLER_STORE);
  }

  // If the user has stores, redirect them to the dashboard of their first store.
  redirect(`${PORTAL_PATHS.LIST_SELLER_STORE}/${stores[0].url}`);
}
