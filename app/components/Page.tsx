import { ReactNode } from "react"

export default function Page({ children, className = '', ...attrs }: { children: ReactNode | ReactNode[], className?: string }) {
    return <div className={`pt-12 p-8 flex flex-col gap-4 overflow-hidden w-full h-full ${className}`} {...attrs}>
        { children }
    </div>
}