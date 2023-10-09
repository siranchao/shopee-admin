'use client'
import React from "react"
import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"


export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement> ) {
    const pathname = usePathname()
    const params = useParams()
    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            active: pathname === `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            active: pathname === `/${params.storeId}/colors`
        },
        {
            href: `/${params.storeId}/sizes`,
            label: "Sizes",
            active: pathname === `/${params.storeId}/sizes`
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            active: pathname === `/${params.storeId}/settings`
        }
    ]

    return (
        <nav>
            <div className="lg:hidden">
                <NavigationMenuDemo data={routes}/>
            </div>

            <div className={cn("flex items-center space-x-4 lg:space-x-6 max-lg:hidden", className)}>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
                    >
                        {route.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
    
}


export function NavigationMenuDemo({ data }: any) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <Menu className="h-6 w-6" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid w-[250px] gap-3 p-4 grid-cols-1">
                        {data.map((item: any) => (
                        <ListItem
                            key={item.href}
                            title={item.label}
                            href={item.href}
                        />
                        ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
   
const ListItem = React.forwardRef<React.ElementRef<"a">,React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
    const pathName = usePathname()
    
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    pathName === props.href && "bg-accent text-accent-foreground",
                    )}
                    
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"