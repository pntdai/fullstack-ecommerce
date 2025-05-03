import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { PORTAL_PATHS } from "@/constants/path";
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  if (!categories) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink={PORTAL_PATHS.CREATE_ADMIN_CATEGORIES}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
    />
  );
}
