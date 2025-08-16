"use client"

import Page from "@/app/components/Page";
import ReceiptForm from "../ReceiptForm";
import { createTicket } from "@/data/tickets";

export default function CreateReceipt() {
    return <Page>
        <ReceiptForm type="create" mutationMethod={createTicket}/>
    </Page>
}