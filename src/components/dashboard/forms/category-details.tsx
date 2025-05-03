"use client";

import ImageUpload from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
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
import { PORTAL_PATHS } from "@/constants/path";
import { useToast } from "@/hooks/use-toast";
import { CategoryFormSchema } from "@/lib/schemas";
import { upsertCategory } from "@/queries/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured,
    },
  });

  const handleSubmitCategory = async (
    values: z.infer<typeof CategoryFormSchema>
  ) => {
    console.log(values);
    try {
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast({
        title: data?.id
          ? "Category has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push(PORTAL_PATHS.LIST_ADMIN_CATEGORIES);
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
      });
    }
  }, [data, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitCategory)}
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
                      ...field.value.filter((current) => current.url !== url),
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Input category name" {...field} />
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
              <FormLabel>Category url</FormLabel>
              <FormControl>
                <Input placeholder="Input Category url" {...field} />
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
            ? "Save category information"
            : "Create category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryDetails;
