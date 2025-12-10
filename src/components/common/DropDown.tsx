"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserRoundIcon as UserRoundPen,
  Wallet2,
  CreditCard,
  Package,
  HelpCircle,
  SmilePlus,
  LogOut,
  ChevronDown,
  Building2,
  BookMarked,
  BookMarkedIcon,
  Bookmark,
  Wallet,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearSessionStorage } from "@/lib/storage";
import { withClientNavigation } from "@/lib/client-wrappers";
import { useWeb3 } from "@/contexts/Web3Context";

const UserDropDown = ({ user }: { user: any }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFinancialsOpen, setIsFinancialsOpen] = useState(false);
  const { isConnected, disconnectWallet } = useWeb3();

  const displayAvatar = user?.avatar;
  const displayName = user?.fullName || "User";

  sessionStorage.setItem("userId", user?._id);

  const handleLogout = () => {
    clearSessionStorage();
    toast.success("Logged out successfully");
    router.push("/auth/signin");
  };

  const toggleFinancials = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsFinancialsOpen(!isFinancialsOpen);
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-lg p-0 hover:bg-gray-100"
          aria-label="User Menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={displayAvatar || "/placeholder.svg"}
              alt="User avatar"
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-500 text-white">
              {displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-64 p-1" sideOffset={5}>
        <DropdownMenuLabel className="text-gray-600 px-3 py-2">
          Hi, {displayName || "User"} 👋
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="mt-1">
          <DropdownMenuItem
            onClick={() => router.push("/profile1")}
            className="cursor-pointer"
          >
            <UserRoundPen className="mr-2 h-4 w-4" />
            My Profile
          </DropdownMenuItem>

          {/* Financials Accordion */}

          <DropdownMenuItem
            onClick={() => router.push("/orders")}
            className="cursor-pointer"
          >
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={()=>{
              router.push("/portfolio")
            }}
            className="cursor-pointer"
            >
              <ChartNoAxesCombinedIcon className="mr-2 h-4 w-4" />
              Portfolio
            </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/bookmarks")}
            className="cursor-pointer"
          >
            <BookMarkedIcon className="mr-2 h-4 w-4" />
            Bookmarks
          </DropdownMenuItem>
 
       {user?.kycCompleted}
       
          <DropdownMenuItem
            onClick={() => router.push("/kyc-status")}
            className="cursor-pointer"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            kyc Status
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

          {isConnected && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                disconnectWallet();
                toast.success('Wallet disconnected');
              }}
              className="cursor-pointer text-orange-600 hover:!text-orange-700 focus:bg-orange-50"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Disconnect Wallet
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 hover:!text-red-700 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default withClientNavigation(UserDropDown);
