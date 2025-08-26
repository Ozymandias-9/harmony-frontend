'use client'

import React, { Fragment, useEffect, useState } from "react"
import { getReceipts, deleteReceiptById, updateReceiptCategory, disconnectCategoryFromReceipt } from "@/data/receipts"
import { getCategories, createCategory } from "@/data/categories";
import Page from "@/app/components/Page";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/app/components/Dialog";
import { Combobox } from "../components/Combobox";
import { useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Form, type FieldDefinition } from "@/app/components/Form";
import { categoryFormSchema } from "@/data/schemas/category";

export default function ReceiptsPage() {
    const router = useRouter();
    
    const [receipts, setReceipts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
    const [selectedReceiptForDeletion, setSelectedReceiptForDeletion] = useState<any>(null);
    const [categoryCreationDialog, setCategoryCreationDialog] = useState<{ res(value: unknown): void } | null>(null);
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
            accessorKey: 'categories',
            header: 'Category',
            cell: ({ row }: any) => {
                const data = row.original;
                return <div className="flex gap-1">
                    <Combobox
                        className={`px-2 py-1 text-xs rounded-md bg-accent text-foreground ${data?.categories.length === 0 ? 'text-gray-400 hover:text-gray-600' : 'hover:text-gray-600'} cursor-pointer`}
                        subject="category"
                        options={categories}
                        value={null}
                        onChange={async (newValue) => {
                            const result = await updateReceiptCategory(row.original.id, parseInt(newValue));

                            if (result) {
                                setReceipts(await getReceipts());
                            }
                        }}
                        create={() => {
                            return new Promise((res) => {
                                setCategoryCreationDialog({ res });
                            })
                        }}
                        hideSubjectFromButton={!(data.categories.length > 0)}
                    />
                    {
                        data.categories.map((category: any) => {
                            return <span key={category.id} className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-accent text-foreground hover:text-gray-600 cursor-pointer">
                                <Icon onClick={() => onDisconnectCategory(data.id, category.id)} icon="lucide:x"/>
                                <span>{ category.name }</span>
                            </span>
                        })
                    }
                </div>;
            },
            accessorFn: (originalRow: any) => originalRow.category?.name,
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
        setCategories((await getCategories({ entity: "receipt" })).map((c: any) => ({ value: c.id, label: c.name })));
    }

    const onCreateCategory = async (data: any) => {
        const result = await createCategory(data);

        if (result) {
            setCategoryCreationDialog(null);
            await fetchDeps();
        }

        if (categoryCreationDialog !== null) {
            categoryCreationDialog?.res(result.id ?? null);
        }
    }

    const onDisconnectCategory = async (id: number, categoryId: number) => {
        const result = await disconnectCategoryFromReceipt(id, categoryId);
        
        if (result) {
            setCategoryCreationDialog(null);
            await fetchDeps();
        }
    }

    useEffect(() => {
        fetchDeps();
    }, [])

    const createCategoryFormShape = {
        dialog: {
            title: 'Create Category',
            description: 'Create a category for your items.',
        },
        form: {
            mutationType: 'create',
            fields: [
                {
                    label: 'Name',
                    field: 'name',
                    placeholder: "Health",
                    type: 'text',
                },
            ],
            formSchema: categoryFormSchema,
        }
    }

    return <Page title="Receipts">
        <div className="flex flex-col gap-3 overflow-hidden">
            <div className="flex justify-end">
                <Button onClick={() => router.push("/receipts/create")}>
                    <span className="size-4 aspect-square">
                        <Icon icon="lucide:plus" />
                    </span>
                </Button>
            </div>

            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <DataTable
                        columns={columns}
                        data={receipts}
                    />
                </ResizablePanel>
                {
                    selectedReceipt && (
                        <Fragment>
                            <ResizableHandle className="mx-4" withHandle />
                            <ResizablePanel defaultSize={40} className="bg-background relative flex-1 flex flex-col p-4 rounded-lg border gap-2 overflow-hidden">
                                <Icon onClick={() => setSelectedReceipt(null)} className="size-6 absolute top-4 right-4 cursor-pointer" icon="lucide:x"/>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-gray-800">{ selectedReceipt?.name }</h2>
                                    <p className="text-sm text-gray-400 mb-4">
                                        { selectedReceipt?.store } - { selectedReceipt?.creationDate ? (new Date(selectedReceipt?.creationDate))?.toISOString().split('T').slice(0,1)[0] : '' }
                                    </p>
                                </div>
                                <div className="flex flex-col overflow-y-auto gap-2">
                                    {
                                        selectedReceipt.purchases?.map((sp: any) => (
                                            <div key={sp.id} className="text-sm rounded-md w-full flex items-center gap-2">
                                                <span>{ parseFloat(sp.quantity).toFixed(2) }x</span>
                                                <div className="flex items-center gap-2">
                                                    <span>{ sp.item?.name }</span>
                                                    <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-black cursor-pointer">{ sp.item?.category?.name }</span>
                                                </div>
                                                <span>* { sp.unitPrice}</span>
                                                <div className="ml-auto text-right">{ Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                    }).format(sp.price)
                                                }</div>
                                            </div>
                                        ))
                                    }
                                </div>
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
                            </ResizablePanel>
                        </Fragment>
                    )
                }
            </ResizablePanelGroup>
        </div>

        <Dialog
            title={createCategoryFormShape.dialog.title}
            description={createCategoryFormShape.dialog.description}
            open={categoryCreationDialog !== null}
            onOpenChange={() => setCategoryCreationDialog(null)}
        >
            <Form
                callback={(v) => onCreateCategory(v)}
                fields={createCategoryFormShape.form.fields as FieldDefinition[]}
                defaultValues={{ name: '', entity: "receipt" }}
                formSchema={createCategoryFormShape.form.formSchema}
            />
        </Dialog>

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