'use client'

import React, { useState, useEffect } from "react"
import { getItems, createItem, updateItemsCategory, deleteItem, updateItem } from "@/data/items"
import { getCategories } from "@/data/categories"
import Page from "@/app/components/Page";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "../components/Dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "../components/Form";
import { itemFormSchema } from "@/data/schemas/item";
import { Combobox } from "../components/Combobox"; 

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [dialogSchema, setDialogSchema] = useState<{ dialog: any, form: any }>({ dialog: {}, form: {} });
    const [confirmationDialog, setConfirmationDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: number }>({ id: 0 });
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
            sortable: true,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }: any) => {
                const data = row.original;
                return <Combobox
                    className={`px-2 py-1 text-xs rounded-md bg-accent text-foreground ${!data?.category?.id ? 'text-gray-400 hover:text-gray-600' : 'hover:text-gray-600'} cursor-pointer`}
                    subject="category"
                    options={categories}
                    value={data?.category?.id ?? null}
                    onChange={async (newValue) => {
                        const result = await updateItemsCategory(row.original.id, parseInt(newValue));

                        if (result) {
                            setItems(await getItems());
                        }
                    }}
                />;
            },
            accessorFn: (originalRow: any) => originalRow.category?.name,
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
                    <div onClick={() => triggerMutationDialog(true, 'edit', row.original)} className="rounded-md transition-all duration-300">
                        <Icon className="text-lg text-lime-500 cursor-pointer" icon="lucide:pencil"/>
                    </div>
                </div>
            }
        }
    ]

    const fetchDeps = async () => {
        setItems(await getItems());
        setCategories((await getCategories()).map((c: any) => ({ value: c.id, label: c.name })));
    }

    useEffect(() => {
        fetchDeps();
    }, [])

    const onMutate = async (data: any, mType: 'create' | 'edit') => {
        const result = await (mType === 'create' ? createItem(data) : updateItem(selectedItem.id, data));

        if (result) {
            setDialog(false);
            fetchDeps();
        }
    }

    const triggerDeleteModal = (data: any) => {
        setSelectedItem(data);
        setConfirmationDialog(true);
    }

    const confirmDeleteItem = async () => {
        const result = await deleteItem(selectedItem.id);

        if (result) {
            setConfirmationDialog(false);
            fetchDeps();
        }
    }
    
    const createItemFormShape = {
        dialog: {
            title: 'Create Item',
            description: 'Create an item you bought.',
        },
        form: {
            mutationType: 'create',
            fields: [
                {
                    label: 'Name',
                    field: 'name',
                    placeholder: "Leche Alpura 1.8 lt",
                    type: 'text',
                },
                {
                    type: "createOrConnect",
                    field: "categoryId",
                    label: "Category",
                    inputProps: {
                        subject: 'category',
                        options: categories
                    },
                    createKey: 'category',
                    createFields: [
                        { field: "name", label: "Name", type: "text", placeholder: "New category name" }
                    ]
                },
            ],
            formSchema: itemFormSchema,
        }
    }

    const editItemFormShape = {
        dialog: {
            title: 'Edit Item',
            description: 'Edit an item you bought.',
        },
        form: {
            mutationType: 'edit',
            fields: [
                {
                    label: 'Name',
                    field: 'name',
                    placeholder: "Leche Alpura 1.8 lt",
                    type: 'text',
                },
                {
                    type: "combobox",
                    field: "categoryId",
                    label: "Category",
                    inputProps: {
                        subject: 'category',
                        options: categories
                    },
                },
            ],
            formSchema: itemFormSchema,
        }
    }

    const dialogSchemas: { 'create': any, 'edit': any } = {
        'create': createItemFormShape,
        'edit': editItemFormShape,
    }

    const triggerMutationDialog = (open: boolean, dType: 'create' | 'edit', data: any = { name: '', categoryId: undefined, category: { name: '' } },) => {
        setSelectedItem(data);
        setDialogSchema(dialogSchemas[dType])
        setDialog(open);
    }

    return <Page>
        <h1 className="text-2xl font-semibold">Items</h1>

        <div className="overflow-y-auto flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={() => triggerMutationDialog(true, 'create')}>
                    <span className="size-4 aspect-square">
                        <Icon icon="lucide:plus" />
                    </span>
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={items}
            />
        </div>

        <Dialog
            title={dialogSchema.dialog.title}
            description={dialogSchema.dialog.description}
            open={dialog}
            onOpenChange={setDialog}
        >
            <Form
                callback={(v) => onMutate(v, dialogSchema.form.mutationType)}
                fields={dialogSchema.form.fields}
                defaultValues={selectedItem}
                formSchema={dialogSchema.form.formSchema}
            />
        </Dialog>
        <Dialog
            title="Confirmation"
            description="Are you sure you want to delete this item?"
            open={confirmationDialog}
            onOpenChange={setConfirmationDialog}
        >
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex gap-4 rounded-md bg-red-50 text-red-700 px-4 py-3">
                    <Icon className="size-10" icon="lucide:circle-alert" />
                    <p>This action is irreversible and you may not recover the data once you confirm.</p>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <Button onClick={() => setConfirmationDialog(false)}variant="default">Cancel</Button>
                    <Button onClick={() => confirmDeleteItem()}variant="destructive">Confirm</Button>
                </div>
            </div> 
        </Dialog>
    </Page>
}