"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render fallback UI to avoid hydration mismatch
    return (
      <nav className="p-4 bg-gray-900 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-xl font-bold">
            True Feedback
          </a>
          <Button variant="outline" className="bg-slate-100 text-black">
            Login
          </Button>
        </div>
      </nav>
    );
  }

  // Now it's safe to use session info
  return (
    <nav className="p-4 bg-gray-900 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-xl font-bold">
          True Feedback
        </a>
        {status === "authenticated" ? (
          <>
            <span className="mr-4">Welcome, {session.user?.name || session.user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-slate-100 text-black" variant="outline">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
