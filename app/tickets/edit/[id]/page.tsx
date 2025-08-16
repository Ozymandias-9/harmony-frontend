"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import Page from "@/app/components/Page";
import ReceiptForm from "../../ReceiptForm";
import { getTicketById, updateTicketById } from "@/data/tickets";
import { ticketFormSchema } from "@/data/schemas/ticket";

export default function EditReceipt() {
    const { id } = useParams();
    const ticketId = parseInt((id ?? '0').toString());
    const [ticket, setTicket] = useState<undefined | z.infer<typeof ticketFormSchema>>(undefined);

    useEffect(() => {
        if (ticketId) {
            async function init() {
                const result = (await getTicketById(ticketId))[0];
                setTicket({ ...result, creationDate: new Date(result.creationDate)
                });
            }

            init();
        }
    }, [])

    if (ticket !== undefined) {
        return <Page>
            <ReceiptForm type="edit" defaultValues={ticket} mutationMethod={(data: any) => updateTicketById(ticketId, data)}/>
        </Page>
    }
}