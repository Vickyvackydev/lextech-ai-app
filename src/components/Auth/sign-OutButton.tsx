"use client"
import { signOut } from "next-auth/react"
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

export const SignOutButton = ({ className }: { className: string }) => {

    return (
            <button onClick={() => signOut()} className={className}>
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
            </button>
    );
}
