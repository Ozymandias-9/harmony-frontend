'use client'

import React, { useEffect, useState } from "react"
import { getItems } from "@/data/items"
import { getTickets, createTicket } from "@/data/tickets"
import Page from "../components/Page";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "../components/Dialog";
import { Button } from "@/components/ui/button";
import { Form } from "../components/Form";
import { ticketFormSchema } from "@/data/schemas/ticket";

export default function TicketsPage() {
    const [items, setItems] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
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
                return <div className="overflow-hidden text-ellipsis underline text-blue-500 cursor-pointer" onClick={() => setSelectedTicket(row.original)}>
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
        }
    ]

    useEffect(() => {
        async function init() {
            setItems((await getItems()).map((c: any) => ({ value: c.id, label: c.name })));
            setTickets(await getTickets());
        }

        init();
    }, [])

    const onCreateTicket = async (data: any) => {
        console.log(data)
        const result = await createTicket(data);

        if (result) {
            setItems((await getItems()).map((c: any) => ({ value: c.id, label: c.name })));
            setTickets(await getTickets());
            setDialog(false);
        }
    }

    return <Page>
        <h1 className="text-2xl font-semibold">Tickets</h1>

        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={() => setDialog(true)}>
                    <span className="size-4 aspect-square">
                        <Icon icon="lucide:plus" />
                    </span>
                </Button>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 flex">
                    <DataTable
                        columns={columns}
                        data={tickets}
                    />
                </div>
                {
                    selectedTicket && (
                        <div className="bg-background relative self-start flex-1 flex flex-col p-4 rounded-lg inset-shadow-sm ring-1 ring-black/5 gap-2">
                            <Icon onClick={() => setSelectedTicket(null)} className="size-6 absolute top-4 right-4 cursor-pointer" icon="lucide:x"/>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-gray-800">{ selectedTicket?.name }</h2>
                                <p className="text-sm text-gray-400 mb-4">
                                    { selectedTicket?.store } - { selectedTicket?.creationDate ? (new Date(selectedTicket?.creationDate))?.toISOString().split('T').slice(0,1)[0] : '' }
                                </p>
                            </div>
                            {
                                selectedTicket.purchases?.map((sp: any) => (
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
                                    }).format(selectedTicket.purchases?.reduce((a: number, c: any) => (a + parseFloat(c.price)), 0))
                                }</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>

        <Dialog
            title="Create Ticket"
            description="Create a ticket from a shopping trip."
            open={dialog}
            onOpenChange={setDialog}
        >
            <Form
                callback={onCreateTicket}
                fields={[
                    {
                        label: 'Name',
                        field: 'name',
                        placeholder: "Trip to Walmart",
                        type: 'text',
                    },
                    {
                        label: 'Store',
                        field: 'store',
                        placeholder: "Walmart",
                        type: 'text',
                    },
                    {
                        label: 'Creation Date',
                        field: 'creationDate',
                        placeholder: "22/03/24",
                        type: 'date',
                    },
                    {
                        label: 'Purchases',
                        field: 'purchases',
                        type: 'list',
                        fields: [
                            { field: 'price', label: 'Price', type: 'number', placeholder: 'Enter price' },
                            { field: 'purchaseDate', label: 'Purchase Date', type: 'date' },
                            { field: 'itemId', label: 'Item ID', type: 'combobox', placeholder: 'Enter item ID', 
                                inputProps: {
                                    subject: 'item',
                                    options: items
                                },
                            }
                        ],
                    }
                ]}
                defaultValues={{ name: '', store: '', creationDate: new Date(), purchases: [] }}
                formSchema={ticketFormSchema}
            />
        </Dialog>
    </Page>
}