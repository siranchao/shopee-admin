"use client";

import { Loader } from "@/components/ui/loader";


const Loading = () => {
  return ( 
    <div className="flex h-full w-full items-center justify-center mt-20">
      <Loader />
    </div>
   );
}
 
export default Loading;