"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function DataTable({
    data,
    columns,
    selectable = false,
}: {
    data: any,
    columns: any,
    selectable?: boolean,
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        defaultColumn: {
            size: Number.MAX_SAFE_INTEGER,
        },
    })

    const paginationButtons = [];
    for (let i = 0; i < table.getPageCount(); i++) {
        paginationButtons.push(
            <button className={`flex justify-center items-center text-sm cursor-pointer size-6 px-2 rounded-md ${ pagination.pageIndex === i ? 'bg-primary text-primary-foreground' : 'bg-background border text-foreground' }`} key={i} onClick={() => table.setPageIndex(i)}>
                {i + 1}
            </button>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex justify-between items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <Icon icon="lucide:search" />
                    <Input
                        placeholder="Buscar en toda la tabla..."
                        value={(table.getState() as any).globalFilter ?? ''}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="bg-background w-64 max-w-sm"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace(/([A-Z])/g, " $1")}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border bg-white overflow-auto invisible-scrollbar">
                <Table className="table-fixed w-full border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-[1]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const headerContext = header.getContext();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`bg-background border-b ${ !header.column.getIsLastColumn() ? "border-r" : "" }`}
                                            style={{ width: header.getSize() !== Number.MAX_SAFE_INTEGER ? header.getSize() : undefined }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.getCanSort() ? ({ column }: any) => (<span
                                                        className="flex gap-1 items-center"
                                                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                                    >
                                                        { typeof column.columnDef.header === 'string' ? column.columnDef.header : '' }
                                                        <Icon
                                                            icon="lucide:chevron-up" 
                                                            className={`ml-2 size-4 shrink-0 ${
                                                                column.getIsSorted() === "asc"
                                                                ? 'rotate-0'
                                                                : column.getIsSorted() === "desc"
                                                                ? 'rotate-180'
                                                                : 'text-disabled'
                                                            }`}
                                                        />
                                                    </span>) : headerContext.column.columnDef.header,
                                                    headerContext
                                                )}
                                        </TableHead>
                                        
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return <TableCell
                                            key={cell.id}
                                            className={`${index !== table.getRowModel().rows?.length - 1 ? "border-b" : ""} ${ !cell.column.getIsLastColumn() ? "border-r" : "" }`}
                                            style={{ width: cell.column.getSize() !== Number.MAX_SAFE_INTEGER ? cell.column.getSize() : undefined }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                {
                    selectable && <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                }
                <div className="flex gap-1 pb-1">
                    <select
                        className="text-sm "
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                            {pageSize}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`disabled:text-disabled bg-background border text-sm cursor-pointer px-2 rounded-md text-foreground`}
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <Icon icon="lucide:chevron-first" />
                    </button>
                    <button
                        className={`disabled:text-disabled bg-background border text-sm cursor-pointer px-2 rounded-md text-foreground`}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <Icon icon="lucide:chevron-left" />
                    </button>
                    {paginationButtons.map((u) => u)}
                    <button
                        className={`disabled:text-disabled bg-background border text-sm cursor-pointer px-2 rounded-md text-foreground`}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <Icon icon="lucide:chevron-right" />
                    </button>
                    <button
                        className={`disabled:text-disabled bg-background border text-sm cursor-pointer px-2 rounded-md text-foreground`}
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <Icon icon="lucide:chevron-last" />
                    </button>
                </div>
            </div>
        </div>
    )
}
