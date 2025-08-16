import { ReactNode } from "react"

export default function Page({ children, className = '', title, ...attrs }: { children: ReactNode | ReactNode[], className?: string, title?: any }) {
    return <div className={`pt-12 p-8 flex flex-col gap-4 overflow-hidden w-full h-full ${className}`} {...attrs}>
        {
            title !== undefined && <h1 className="text-2xl font-semibold">{ title }</h1>
        }
        { children }
    </div>
}