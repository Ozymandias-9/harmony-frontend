'use client'

import React, { useState, useEffect } from "react"
import { getCategories } from "@/data/categories"
import Page from "@/app/components/Page";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "../components/Dialog";
import { Button } from "@/components/ui/button";
import { Form } from "../components/Form";
import { categoryFormSchema } from "@/data/schemas/category";
import { createCategory, updateCategoryById, deleteCategoryById } from "@/data/categories";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [dialogSchema, setDialogSchema] = useState<{ dialog: any, form: any }>({ dialog: {}, form: {} });
    const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id?: number, name: string, categoryId?: number, category: { name: '' } }>({ name: '', categoryId: undefined, category: { name: '' } });
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
        setCategories(await getCategories());
    }

    useEffect(() => {
        fetchDeps();
    }, [])

    const onMutate = async (data: any, mType: 'create' | 'edit') => {
        let result;
        
        if (mType === 'create') {
            result = await createCategory(data);
        }
        else if (selectedCategory.id !== undefined) {
            result = await updateCategoryById(selectedCategory.id, data);
        }

        if (result) {
            setDialog(false);
            fetchDeps();
        }
    }

    const triggerDeleteModal = (data: any) => {
        setSelectedCategory(data);
        setDeleteConfirmationDialog(true);
    }

    const confirmDeleteItem = async () => {
        if (selectedCategory.id === undefined) return;
        const result = await deleteCategoryById(selectedCategory.id);

        if (result) {
            setDeleteConfirmationDialog(false);
            fetchDeps();
        }
    }
    
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

    const editCategoryFormShape = {
        dialog: {
            title: 'Edit Category',
            description: 'Edit a category for your items.',
        },
        form: {
            mutationType: 'edit',
            fields: [
                {
                    label: 'Name',
                    field: 'name',
                    placeholder: "Health",
                    type: 'text',
                }
            ],
            formSchema: categoryFormSchema,
        }
    }

    const dialogSchemas: { 'create': any, 'edit': any } = {
        'create': createCategoryFormShape,
        'edit': editCategoryFormShape,
    }

    const triggerMutationDialog = (open: boolean, dType: 'create' | 'edit', data: any = { name: '', categoryId: undefined, category: { name: '' } },) => {
        setSelectedCategory(data);
        setDialogSchema(dialogSchemas[dType])
        setDialog(open);
    }

    return <Page title="Categories">
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
                data={categories}
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
                defaultValues={selectedCategory}
                formSchema={dialogSchema.form.formSchema}
            />
        </Dialog>
        <Dialog
            title="Confirmation"
            description="Are you sure you want to delete this category?"
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
                    <Button onClick={() => confirmDeleteItem()}variant="destructive">Confirm</Button>
                </div>
            </div> 
        </Dialog>
    </Page>
}