"use client";

import ImageUpload from "@/components/shared/image-upload";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PORTAL_PATHS } from "@/constants/path";
import { useToast } from "@/hooks/use-toast";
import { SubCategoryFormSchema } from "@/lib/schemas";
import { upsertSubCategory } from "@/queries/subCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, SubCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured,
      categoryId: data?.categoryId,
    },
  });

  const handleSubmitSubCategory = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast({
        title: data?.id
          ? "Sub Category has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push(PORTAL_PATHS.LIST_ADMIN_SUB_CATEGORIES);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
        categoryId: data?.categoryId,
      });
    }
  }, [data, form]);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} Sub Category information.`
              : " Lets create a Sub Category. You can edit subCategory later from the subCategories table or the subCategory page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitSubCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Sub Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory url</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Sub Category url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading || categories.length === 0}
                        defaultValue={field.value}
                      >
                        <SelectTrigger ref={field.ref}>
                          <SelectValue
                            placeholder="Select a category"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Update SubCategory information"
                  : "Create SubCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
