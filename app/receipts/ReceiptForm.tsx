"use client"

import { useState, useEffect, Fragment } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/app/components/Dialog";
import { DatePicker } from '@/components/ui/date-picker';
import {
    Form as FormRoot,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Form, type FieldDefinition } from "@/app/components/Form";
import { ListObjectInput } from '@/app/components/form/ListObjectInput';
import { itemFormSchema } from "@/data/schemas/item";
import { receiptFormSchema } from "@/data/schemas/receipt";
import { getItems, createItem } from "@/data/items";
import { getCategories } from "@/data/categories";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function ReceiptForm({
    defaultValues,
    type,
    mutationMethod,
}:
{
    defaultValues?: z.infer<typeof receiptFormSchema>,
    type: "edit" | "create",
    mutationMethod: Function,
}) {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ name: string, categoryId: number | undefined, category: { name: '' } }>({ name: '', categoryId: undefined, category: { name: '' } });
    const [receiptCreated, setReceiptCreated] = useState<boolean>(false);
    const form = useForm<z.infer<typeof receiptFormSchema>>({
        resolver: zodResolver(receiptFormSchema),
        defaultValues: defaultValues ?? { name: '', store: '', creationDate: new Date(), purchases: [] },
    });

    async function fetchDeps() {
        setItems((await getItems()).map((c: any) => ({ value: c.id, label: c.name })));
        setCategories((await getCategories()).map((c: any) => ({ value: c.id, label: c.name })));
    }

    useEffect(() => {
        fetchDeps();
    }, [])
    
    const onSubmit = async (data: z.infer<typeof receiptFormSchema>) => {
        await mutationMethod(data);
        setReceiptCreated(true);
    };

    const onMutate = async (data: any) => {
        const result = await createItem(data);

        if (result) {
            setDialog(false);
            fetchDeps();
        }
    }

    const goToMainPage = () => {
        setReceiptCreated(false);
        router.push("/receipts")
    }
    
    const continueHere = () => {
        setReceiptCreated(false);
        setSelectedItem({ name: '', categoryId: undefined, category: { name: '' } });
        form.reset();
    }

    const createItemFormShape = {
        dialog: {
            title: 'Create Item',
            description: 'Create an item you bought.',
        },
        form: {
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

    return <Fragment>
        <FormRoot {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 rounded-md border bg-white overflow-hidden p-4">
                <div className="flex gap-4 justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-md font-medium">{ type.charAt(0).toUpperCase() + type.slice(1) } Receipt</h2>
                        <p className="text-sm text-muted-foreground">{ type.charAt(0).toUpperCase() + type.slice(1) } a receipt from a shopping trip.</p>
                    </div>
                    <Button type="submit">
                        Save
                    </Button>
                </div>
                <div className="flex gap-4 overflow-hidden">
                    <div className="flex flex-col gap-4 p-2">
                        <FormField
                            key="name"
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Trip to Walmart"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            key="store"
                            control={form.control}
                            name="store"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Walmart"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            key="creationDate"
                            control={form.control}
                            name="creationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Creation Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value}
                                                onChange={(e) => field.onChange(e)}
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <span className="bg-border w-[1px] h-full"></span>
                    <div className="flex gap-4 flex-1 overflow-y-auto p-2">
                        <FormField
                            key="purchases"
                            control={form.control}
                            name="purchases"
                            render={({ field }) => (
                                <FormItem className='flex flex-col w-full overflow-hidden'>
                                    <FormLabel>Purchases</FormLabel>
                                    <FormControl>
                                        <ListObjectInput
                                            value={field.value}
                                            onChange={(v: any) => 
                                                field.onChange(v.map((pur: any) => ({ ...pur, price: pur.quantity * pur.unitPrice })))
                                            }
                                            onInputChange={(key: string, v: any, currentItem: any) => {
                                                if (key === "quantity" || key === "unitPrice") {
                                                    let missingPiece = key === "quantity" ? "unitPrice" : "quantity";
                                                    if (currentItem[missingPiece] && v) {
                                                        return {
                                                            ...currentItem,
                                                            [key]: v,
                                                            price: currentItem[missingPiece] * v
                                                        };
                                                    }
                                                    return { ...currentItem, [key]: v, price: 0 };
                                                }
                                            }}
                                            fieldDefs={[
                                                { field: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity',
                                                    render: (value: any) => parseFloat(value).toFixed(2)
                                                },
                                                { field: 'unitPrice', label: 'Unit Price', type: 'number', placeholder: 'Enter unit price',
                                                    render: (value: any) => parseFloat(value).toFixed(2)
                                                },
                                                { field: 'price', label: 'Price', type: 'number', placeholder: 'Enter price',
                                                    render: (value: any) => parseFloat(value).toFixed(2)
                                                 },
                                                { field: 'itemId', label: 'Item ID', type: 'combobox', 
                                                    inputProps: {
                                                        subject: 'item',
                                                        options: items,
                                                        create: () => setDialog(true)
                                                    },
                                                    render: (value: any) => (items.find((i: any) => i.value === value) as any)?.label, 
                                                }
                                            ]}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </FormRoot>
        
        <Dialog
            title={createItemFormShape.dialog.title}
            description={createItemFormShape.dialog.description}
            open={dialog}
            onOpenChange={setDialog}
        >
            <Form
                callback={(v) => onMutate(v)}
                fields={createItemFormShape.form.fields as FieldDefinition[]}
                defaultValues={selectedItem}
                formSchema={createItemFormShape.form.formSchema}
            />
        </Dialog>


        <Dialog
            title={`Receipt ${ type } successfully`}
            description={`Receipt was ${ type } successfully! What do you want to do next?`}
            open={receiptCreated}
            onOpenChange={goToMainPage}
        >
            <div className="flex justify-end gap-4">
                <Button onClick={goToMainPage} variant="destructive">
                    Go to main page.
                </Button>
                <Button onClick={continueHere}>
                    Continue here.
                </Button>
            </div>
        </Dialog>
    </Fragment>
}