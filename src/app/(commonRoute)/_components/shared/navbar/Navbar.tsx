"use client";

import { useEffect, useState } from "react";
import { MenuIcon, LogOut, LayoutDashboard, UserCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/src/components/shared/ThemeToggle";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { getUser, UserLogOut, getMe } from "@/src/services/auth";



export const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const decodedUser = await getUser();
      if (decodedUser) {
        const fullProfile = await getMe();
        if (fullProfile?.success) {
          setUser(fullProfile.data);
        } else {
          setUser(decodedUser);
        }
      }
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
    {
      title: "Blog",
      description: "Our mission to support student employment",
      href: "/blog",
    },
  ];

  return (
    <section className="py-4 bg-background/80 sticky top-0 z-50 backdrop-blur-md border-b border-border">
      <div className="container">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary dark:bg-violet-400 text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10 transition-transform hover:scale-105 ">
              <span className="text-2xl font-bold italic">H</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary dark:text-white">
              HelpMate
            </span>
          </Link>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500">Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="border-primary/50 bg-transparent shadow-lg shadow-primary/5 grid w-[600px] grid-cols-2 p-3 border-1 rounded-xl">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        asChild
                        key={index}
                        className=" rounded-md p-3 transition-colors hover:bg-primary/5 cursor-pointer"
                      >
                        <Link href={feature.href}>
                          <p className="mb-1 font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
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
                      className={`${navigationMenuTriggerStyle()} bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500`}
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
                      className={`${navigationMenuTriggerStyle()} bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500`}
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
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500`}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/blog"
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500`}
                  >
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-black dark:text-gray-100 hover:text-primary dark:hover:text-amber-500`}
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-4 lg:flex">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard/user/post-task">
                  <Button className="bg-primary text-white hover:bg-primary/90 flex gap-2 shadow-lg shadow-primary/20 rounded-xl px-6">
                    <PlusCircle className="w-4 h-4" />
                    Post a Task
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent p-0">
                       <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors">
                         <AvatarImage src={user.avatarUrl} alt={user.name} />
                         <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name?.[0]}</AvatarFallback>
                       </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 rounded-2xl bg-white dark:bg-zinc-950 border-border shadow-2xl" align="end" sideOffset={12}>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <span className="mt-1 w-fit px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                          {user.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors font-medium">
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors font-medium">
                        <UserCircle className="w-4 h-4 text-primary" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 font-bold hover:bg-muted rounded-xl">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform font-bold px-6 rounded-xl shadow-xl">Join Now</Button>
                </Link>
              </div>
            )}

          </div>

          <Sheet>
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-black/10 dark:border-white/10 text-black dark:text-white">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </div>
            <SheetContent side="top" className="max-h-screen overflow-auto bg-background border-border">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black shadow-lg">
                      <span className="text-lg font-bold italic">H</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      HelpMate
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline text-foreground">
                      Explore
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2">
                        {features.map((feature, index) => (
                          <Link
                            href={feature.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted"
                          >
                            <p className="mb-1 font-semibold text-foreground">
                              {feature.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
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
                    <Link href="/tasks" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      Find Tasks
                    </Link>
                  )}
                  {(user?.role === "USER" || user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                    <Link href="/runners" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      Find Runner
                    </Link>
                  )}
                  <Link href="/about-us" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4 pt-4 border-t border-border">
                  {user ? (
                    <>
                      <Link href="/dashboard/user/post-task">
                        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                          <PlusCircle className="w-5 h-5" />
                          Post a Task
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button className="w-full justify-start gap-3 bg-muted hover:bg-muted/80 text-foreground border border-border">
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
                        <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">Sign in</Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90">Join Now</Button>
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
