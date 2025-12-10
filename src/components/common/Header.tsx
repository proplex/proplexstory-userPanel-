"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUserDetails from "@/hooks/user/useUserDetail";
import { getSessionStorage } from "@/lib/storage";
import { HeaderSkeleton } from "./SkeletonUIS";
import DropDown from "./DropDown";
import { withClientNavigation } from "@/lib/client-wrappers";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { useWeb3 } from '@/contexts/Web3Context';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useWeb3();

  const [step, setStep] = useState<
    | "email"
    | "otp"
    | "success"
    | "customer"
    | "created"
    | "verifyAadhar"
    | "AadharOTP"
    | "mobileOTP"
    | "mobile"
    | null
  >(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [mobile, setMobile] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasShownCustomerDialog, setHasShownCustomerDialog] = useState(false);
  const { data: userData, loading, fetchData } = useUserDetails();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const accessToken = getSessionStorage("accessToken");
    const sessionId = getSessionStorage("sessionId");
    const storedUserId = getSessionStorage("userId");

    const isLoggedIn = !!(accessToken && sessionId);
    setIsAuthenticated(isLoggedIn);

    if (isLoggedIn) {
      if (!userData) fetchData();
      if (storedUserId) setUserId(storedUserId);
    }

    if (userData?.isNewUser && !hasShownCustomerDialog) {
      setStep("customer");
      setHasShownCustomerDialog(true);
      if (storedUserId && !userId) setUserId(storedUserId);
    }
  }, [userData, hasShownCustomerDialog, userId, fetchData]);

  if (loading && !isAuthenticated && !userData) return <HeaderSkeleton />;

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/proplex.png"
              alt="proplex logo"
              width={50}
              height={25}
              className="h-auto w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">{}</nav>
        </div>

        {}
        <div className="flex items-center gap-4">
          {!userData?._id ||
          !getSessionStorage("accessToken") ||
          !getSessionStorage("refreshToken") ? (
            <Button
              onClick={() => router.push("/auth/signin")}
              className="px-6 bg-black hover:bg-black text-white"
            >
              Login
            </Button>
          ) : (
            <>
              <ConnectWalletButton />
              <DropDown user={userData} />
              
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default withClientNavigation(Header);
