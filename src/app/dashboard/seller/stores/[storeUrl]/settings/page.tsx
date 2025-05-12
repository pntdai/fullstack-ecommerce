import StoreDetails from "@/components/dashboard/forms/store-details";
import { PORTAL_PATHS } from "@/constants/path";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const storeDetails = await db.store.findUnique({
    where: {
      url: params.storeUrl,
    },
  });

  if (!storeDetails) redirect(PORTAL_PATHS.LIST_SELLER_STORE);

  return (
    <div>
      <StoreDetails data={storeDetails} />
    </div>
  );
}
