"use client"

import React from "react"
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return <nav className="h-full py-6 px-3 border border-border flex flex-col gap-2">
        <img className="size-9 mb-8 self-center" src="/icon.svg" alt="icon" />
        <Link href="/receipts" className={`flex items-center gap-3 text-sm px-3 py-1 rounded-md ${pathname == "/receipts" ? "bg-input/40" : ""}`}>
            <Icon className="text-2xl" icon="lucide:ticket" />
            <span>Receipts</span>
        </Link>
        <Link href="/items" className={`flex items-center gap-3 text-sm px-3 py-1 rounded-md ${pathname == "/items" ? "bg-input/40" : ""}`}>
            <Icon className="text-2xl" icon="tabler:package" />
            <span>Items</span>
        </Link>
    </nav>
}