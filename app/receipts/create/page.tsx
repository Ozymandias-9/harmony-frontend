"use client"

import Page from "@/app/components/Page";
import ReceiptForm from "@/app/components/receipts/ReceiptForm";
import { createReceipt } from "@/data/receipts";

export default function CreateReceipt() {
    return <Page title="Receipts">
        <ReceiptForm type="create" mutationMethod={createReceipt}/>
    </Page>
}