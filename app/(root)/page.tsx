import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
      <>
        <div className="flex items-center justify-between bg-gray-200 p-4">
            <Button size="default" variant="default">Click Me-1</Button>
            <UserButton afterSignOutUrl="/"/>
        </div>
      </>
    )
  }
  