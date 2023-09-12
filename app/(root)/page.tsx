import { Button } from "@/components/ui/button";


export default function Home() {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
            <Button size="default" variant="default">Click Me-1</Button>
        </div>
        <div className="flex flex-col items-center justify-center h-screen bg-red-300">
            <Button size="default" variant="ghost">Click Me-2</Button>
        </div>
        <div className="flex flex-col items-center justify-center h-screen bg-blue-200">
            <Button size="default" variant="outline">Click Me-3</Button>
        </div>
      </>
    )
  }
  