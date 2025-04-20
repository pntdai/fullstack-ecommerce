"use client";
import { Category } from "@prisma/client";
// React
import { FC, useEffect } from "react";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  return <div>Add new category for admin</div>;
};

export default CategoryDetails;
