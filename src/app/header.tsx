import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
  return (
    <nav className="border-b p-3 px-5 bg-slate-100">
      <div className="container p-0 mx-auto flex justify-between items-center">
        <Image className="cursor-pointer" src="/logo.svg" alt="" width={30} height={30} />
        <div className="flex gap-2 items-center">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
