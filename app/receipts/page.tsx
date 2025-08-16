'use client'

import React, { useEffect, useState } from "react"
import { getReceipts, deleteReceiptById } from "@/data/receipts"
import Page from "@/app/components/Page";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/app/components/Dialog";
import { useRouter } from "next/navigation";

export default function ReceiptsPage() {
    const router = useRouter();
    
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
    const [selectedReceiptForDeletion, setSelectedReceiptForDeletion] = useState<any>(null);
    const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false);
    const columns = [
        {
            accessorKey: 'id',
            header: 'Id',
            sortable: true,
            size: 80,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row, getValue }: any) => {
                return <div className="overflow-hidden text-ellipsis underline text-blue-500 cursor-pointer" onClick={() => setSelectedReceipt(row.original)}>
                    { getValue() }
                </div>;
            },
            sortable: true,
        },
        {
            accessorKey: 'creationDate',
            header: 'Creation Date',
            sortable: true,
            sortingFn: 'datetime',
            enableColumnFilter: true,
            cell: ({ row }: any) => (row.original.creationDate ? (new Date(row.original.creationDate))?.toISOString().split('T').slice(0,1)[0] : ''),
        },
        {
            accessorKey: 'store',
            header: 'Store',
            sortable: true,
        },
        {
            id: 'total',
            header: 'Total',
            sortable: true,
            cell: ({ row }: any) => {
                return Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row.original.purchases?.reduce((a: number, c: any) => (a + parseFloat(c.price)), 0))
            },
            accessorFn: (originalRow: any) => originalRow.purchases?.reduce((a: number, c: any) => a + parseFloat(c.price), 0) ?? 0,
        },
        {
            id: 'actions',
            size: 70,
            cell: ({ row }: any) => {
                return <div className="w-auto self-center flex justify-start gap-2 rounded-md">
                    <div onClick={() => triggerDeleteModal(row.original)} className="rounded-md transition-all duration-300">
                        <Icon className="text-lg text-red-500 cursor-pointer" icon="lucide:trash"/>
                    </div>
                    <div className="self-stretch bg-gray-300 w-[1px]"></div>
                    <div onClick={() => triggerEditReceipt(row.original)} className="rounded-md transition-all duration-300">
                        <Icon className="text-lg text-lime-500 cursor-pointer" icon="lucide:pencil"/>
                    </div>
                </div>
            }
        }
    ]

    const triggerEditReceipt = (data: any) => {
        router.push(`/receipts/edit/${data.id}`)
    }

    const triggerDeleteModal = (data: any) => {
        setSelectedReceiptForDeletion(data);
        setDeleteConfirmationDialog(true);
    }

    const confirmDeleteReceipt = async () => {
        if (selectedReceiptForDeletion.id === undefined) return;
        const result = await deleteReceiptById(selectedReceiptForDeletion.id);

        if (result) {
            setDeleteConfirmationDialog(false);
            fetchDeps();
        }
    }

    const fetchDeps = async () => {
        setReceipts(await getReceipts());
    }

    useEffect(() => {
        fetchDeps();
    }, [])

    return <Page title="Receipts">
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={() => router.push("/receipts/create")}>
                    <span className="size-4 aspect-square">
                        <Icon icon="lucide:plus" />
                    </span>
                </Button>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 flex">
                    <DataTable
                        columns={columns}
                        data={receipts}
                    />
                </div>
                {
                    selectedReceipt && (
                        <div className="bg-background relative self-start flex-1 flex flex-col p-4 rounded-lg border gap-2">
                            <Icon onClick={() => setSelectedReceipt(null)} className="size-6 absolute top-4 right-4 cursor-pointer" icon="lucide:x"/>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-gray-800">{ selectedReceipt?.name }</h2>
                                <p className="text-sm text-gray-400 mb-4">
                                    { selectedReceipt?.store } - { selectedReceipt?.creationDate ? (new Date(selectedReceipt?.creationDate))?.toISOString().split('T').slice(0,1)[0] : '' }
                                </p>
                            </div>
                            {
                                selectedReceipt.purchases?.map((sp: any) => (
                                    <div key={sp.id} className="text-sm rounded-md w-full flex gap-4">
                                        <div className="flex-1 flex items-center gap-2">
                                            <span>{ sp.item?.name }</span>
                                            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-black cursor-pointer">{ sp.item?.category?.name }</span>
                                        </div>
                                        <div className="text-right">{ Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(sp.price)
                                        }</div>
                                    </div>
                                ))
                            }
                            <div className="text-sm rounded-md w-full flex gap-2">
                                <div className="flex-1 flex items-center gap-2">
                                    Total
                                </div>
                                <div className="flex-1 text-right">{
                                    Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(selectedReceipt.purchases?.reduce((a: number, c: any) => (a + parseFloat(c.price)), 0))
                                }</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>


        <Dialog
            title="Confirmation"
            description="Are you sure you want to delete this receipt?"
            open={deleteConfirmationDialog}
            onOpenChange={setDeleteConfirmationDialog}
        >
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex gap-4 rounded-md bg-red-50 text-red-700 px-4 py-3">
                    <Icon className="size-10" icon="lucide:circle-alert" />
                    <p>This action is irreversible and you may not recover the data once you confirm.</p>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <Button onClick={() => setDeleteConfirmationDialog(false)}variant="default">Cancel</Button>
                    <Button onClick={() => confirmDeleteReceipt()}variant="destructive">Confirm</Button>
                </div>
            </div> 
        </Dialog>
    </Page>
}