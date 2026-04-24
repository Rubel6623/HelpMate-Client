"use client";

import { useEffect, useState } from "react";
import { MenuIcon, LogOut, LayoutDashboard, UserCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { getUser, UserLogOut } from "@/src/services/auth";

export const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await UserLogOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

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
      title: "About HelpMate",
      description: "Our mission to support student employment",
      href: "/about-us",
    },
  ];

  return (
    <section className="py-4 bg-transparent sticky top-0 z-50 backdrop-blur-md">
      <div className="container">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10 transition-transform hover:scale-105 ">
              <span className="text-2xl font-bold italic">H</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              HelpMate
            </span>
          </Link>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-100 hover:text-amber-500 ">Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3 bg-black/90 border border-white/10 backdrop-blur-xl">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        asChild
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-white/10 cursor-pointer"
                      >
                        <Link href={feature.href}>
                          <p className="mb-1 font-semibold text-white">
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {feature.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {(user?.role === "RUNNER" || user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/tasks"
                      className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-100 hover:text-amber-500`}
                    >
                      Find Tasks
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {(user?.role === "USER" || user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/runners"
                      className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-100 hover:text-amber-500`}
                    >
                      Find Runner
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about-us"
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-100 hover:text-amber-500`}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-gray-100 hover:text-amber-500`}
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <>
                <Link href="/dashboard/user/post-task">
                  <Button className="bg-primary text-white hover:bg-primary/90 flex gap-2 shadow-lg shadow-primary/20">
                    <PlusCircle className="w-4 h-4" />
                    Post a Task
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/50 flex gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 flex gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-black hover:bg-white/90">Join Now</Button>
                </Link>
              </>
            )}
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
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black shadow-lg">
                      <span className="text-lg font-bold italic">H</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                      HelpMate
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline text-white">
                      Explore
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2">
                        {features.map((feature, index) => (
                          <Link
                            href={feature.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-white/5"
                          >
                            <p className="mb-1 font-semibold text-white">
                              {feature.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              {feature.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-4 mb-8">
                  {(user?.role === "RUNNER" || user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                    <Link href="/tasks" className="text-lg font-medium text-white hover:text-white/80 transition-colors">
                      Find Tasks
                    </Link>
                  )}
                  {(user?.role === "USER" || user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                    <Link href="/runners" className="text-lg font-medium text-white hover:text-white/80 transition-colors">
                      Find Runner
                    </Link>
                  )}
                  <Link href="/about-us" className="text-lg font-medium text-white hover:text-white/80 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium text-white hover:text-white/80 transition-colors">
                    Contact
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  {user ? (
                    <>
                      <Link href="/dashboard/user/post-task">
                        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                          <PlusCircle className="w-5 h-5" />
                          Post a Task
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        onClick={handleLogout}
                        variant="outline" 
                        className="w-full justify-start gap-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Sign in</Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full bg-white text-black hover:bg-white/90">Join Now</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};
