import React from "react";

import NavMainAdmin from "./navmain-admin";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./toggle-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type Props = {};

const user = {
  name: "Admin",
  email: "admin@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

const NavBarAdmin = ({}: Props) => {
  return (
    <div className="">
      <div className="flex justify-between w-full px-20 bg-white py-2">
        <div className="flex items-center">
          <Link className="text-lg flex items-center" href={"/admin"}>
            <i className="bi bi-apple"></i>
          </Link>
          <NavMainAdmin />
        </div>

        <div className="relative flex gap-3 items-center">
          <ModeToggle/>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage className="" src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-38">
              <div className="p-4">
                <p className="text-sm">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="border-t">
                <DropdownMenuItem asChild>
                  <button className="w-full text-left p-2 hover:bg-gray-100">
                    Account Settings
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full text-left p-2 hover:bg-gray-100">
                    Logout
                  </button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator/>
    </div>
  );
};

export default NavBarAdmin;
