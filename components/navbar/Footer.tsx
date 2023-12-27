import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator";

const footerLinks = [
    {
      title: "About",
      links: [
        { title: "How it works", url: "/" },
        { title: "Featured", url: "/" },
        { title: "Partnership", url: "/" },
        { title: "Bussiness Relation", url: "/" },
      ],
    },
    {
      title: "Company",
      links: [
        { title: "Events", url: "/" },
        { title: "Blog", url: "/" },
        { title: "Podcast", url: "/" },
        { title: "Invite a friend", url: "/" },
      ],
    },
    {
      title: "Socials",
      links: [
        { title: "Discord", url: "/" },
        { title: "Instagram", url: "/" },
        { title: "Twitter", url: "/" },
        { title: "Facebook", url: "/" },
      ],
    },
  ];

export default function Footer() {


    return (
        <>
            <footer className="flex flex-col text-back-100 mt-16 border-t">
                <div className="flex max-md:flex-col flex-wrap justify-between gap-4 sm:px-16 px-4 py-10">

                    <div className="flex flex-col justify-start items-start gap-4 max-md:hidden md:w-1/3 lg:flex-1">
                        <Image src="/logo3.png" alt="logo" width={100} height={100} className="object-contain"/>
                        <p className="text-base text-gray-700">Shopee 2023 <br/> All rights reserved &copy;</p>
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-10">
                        {footerLinks.map((link, index) => (
                            <div key={index} className="flex flex-col gap-2 text-base sm:gap-4">
                                <h3 className="font-bold">{link.title}</h3>
                                {link.links.map((item, index) => (
                                    <Link key={index} href={item.url} className="text-gray-500">{item.title}</Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="w-11/12 m-auto h-[1px] border-t"/>

                <div className="flex justify-between sm:px-16 px-6 py-10 ">
                        <div className="flex-1 flex flex-col lg:flex-row gap-2">
                            <p>@2023 Shoppe Inc.</p>
                            <p>All Rights Reservered</p>
                        </div>
                        
                        <div className="flex-1 flex gap-4 md:justify-start">
                            <Link href="/" className="text-gray-500 px-4">Privacy Policy</Link>
                            <Link href="/" className="text-gray-500 px-4">Term of Use</Link>
                        </div>              
                    </div>
            </footer>
        </>
    )
}