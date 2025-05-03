import SubCategoryDetails from "@/components/dashboard/forms/sub-category-detail";
import DataTable from "@/components/ui/data-table";
import { PORTAL_PATHS } from "@/constants/path";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Sub Category
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink={PORTAL_PATHS.CREATE_ADMIN_SUB_CATEGORIES}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name..."
      columns={columns}
    />
  );
}
