"use client";

import { MenuIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

export const Navbar = () => {
  const features = [
    {
      title: "How it Works",
      description: "Learn how to post tasks or earn as a runner",
      href: "/how-it-works",
    },
    {
      title: "Categories",
      description: "Explore errand types from grocery to tech help",
      href: "/categories",
    },
    {
      title: "Trust & Safety",
      description: "Our verification and escrow payment systems",
      href: "/safety",
    },
    {
      title: "Become a Runner",
      description: "Join our community of verified student runners",
      href: "/signup?role=RUNNER",
    },
    {
      title: "Support",
      description: "Get help from our 24/7 ops team",
      href: "/support",
    },
  ];

  return (
    <section className="py-4 bg-transparent sticky top-0 z-50 backdrop-blur-md">
      <div className="container">
        <nav className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10 transition-transform hover:scale-105">
              <span className="text-2xl font-bold italic">Q</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              QuickStep
            </span>
          </a>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3 bg-black/90 border border-white/10 backdrop-blur-xl">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-white/10"
                      >
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold text-white">
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:text-white`}
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:text-white`}
                >
                  Resources
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-300 hover:text-white`}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <Button variant="ghost" className="text-white hover:bg-white/10">Sign in</Button>
            <Button className="bg-white text-black hover:bg-white/90">Start for free</Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="border-white/10 text-white">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto bg-black/95 border-white/10">
              <SheetHeader>
                <SheetTitle>
                  <a
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-lg">
                      <span className="text-lg font-bold italic">Q</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                      QuickStep
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <a
                            href={feature.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div key={feature.title}>
                              <p className="mb-1 font-semibold text-foreground">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <a href="#" className="font-medium">
                    Templates
                  </a>
                  <a href="#" className="font-medium">
                    Blog
                  </a>
                  <a href="#" className="font-medium">
                    Pricing
                  </a>
                </div>
                {/* <div className="mt-6 flex flex-col gap-4">
                  <Button variant="outline">Sign in</Button>
                  <Button>Start for free</Button>
                </div> */}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};
