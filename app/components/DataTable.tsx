import React, { ReactNode} from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function DataTable({ caption, data, fields }: { caption?: ReactNode | ReactNode[], data: any, fields: any }) {
    return (
        <Table>
            <TableCaption>{ caption }</TableCaption>
            <TableHeader>
                <TableRow>
                    {
                        fields.map(({ className, name }: { className: string, name: string }) => {
                            return <TableHead key={name} className={`${className}`}>{name}</TableHead>
                        })
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row: any) => (
                    <TableRow key={row.id}>
                        {
                            fields.map(({ field, render }: { field: string, render: Function }, index: number) => (
                                <TableCell key={`tc-${row.id}-${index}`}>{ render ? render(row, row[field]) : row?.[field] }</TableCell>
                            ))
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
