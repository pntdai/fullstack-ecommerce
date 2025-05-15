export default async function SellerProductsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  return <>{params.storeUrl}</>;
}
