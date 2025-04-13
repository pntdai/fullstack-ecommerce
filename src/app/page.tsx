import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 gap-2 flex justify-end">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}
