"use server";

import { EUserRole } from "@/constants/enum";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { SubCategory } from "@prisma/client";

// Function: upsertSubCategory
// Description: Upserts a subCategory into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - SubCategory: subCategory object containing details of the subCategory to be upserted.
// Returns: Updated or newly created subCategory details.
export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    const user = await currentUser();
    console.log(",subCategory", subCategory);

    if (!user) throw new Error("Unauthenticated.");

    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry."
      );

    if (!subCategory) throw new Error("Please provide subCategory data.");

    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "A SubCategory with the same name already exists";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "A SubCategory with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    throw error;
  }
};

// Function: getAllSubCategories
// Description: Retrieves all subCategories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order.
export const getAllSubCategories = async () => {
  const subCategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getSubCategory
// Description: Retrieves a specific SubCategory from the database.
// Access Level: Public
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be retrieved.
// Returns: Details of the requested SubCategory.
export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Please provide suCategory ID.");

  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Function: deleteSubCategory
// Description: Deletes a SubCategory from the database.
// Permission Level: Admin only
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteSubCategory = async (subCategoryId: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated.");

  if (user.privateMetadata.role !== EUserRole.ADMIN)
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  if (!subCategoryId) throw new Error("Please provide category ID.");

  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};

// Function: getSubcategories
// Description: Retrieves subcategories from the database, with options for limiting results and random selection.
// Parameters:
//   - limit: Number indicating the maximum number of subcategories to retrieve.
//   - random: Boolean indicating whether to return random subcategories.
// Returns: List of subcategories based on the provided options.
export const getSubcategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }
  try {
    const queryOptions = {
      take: limit || undefined,
      orderBy: random ? { createdAt: SortOrder.desc } : undefined,
    };

    if (random) {
      const subcategories = await db.$queryRaw<SubCategory[]>`
    SELECT * FROM SubCategory
    ORDER BY RAND()
    LIMIT ${limit || 10} 
    `;
      return subcategories;
    } else {
      const subcategories = await db.subCategory.findMany(queryOptions);
      return subcategories;
    }
  } catch (error) {
    throw error;
  }
};
