import { ReactNode } from "react"
import {
    Dialog as DialogComponent,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function Dialog(
    { children, description, title, ...props }:
    { children: ReactNode | ReactNode[], description?: ReactNode | ReactNode[], title?: ReactNode | ReactNode[], open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <DialogComponent {...props}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </DialogComponent>
    )
}
