"use client"

import Page from "@/app/components/Page";
import ReceiptForm from "../ReceiptForm";
import { createReceipt } from "@/data/receipts";

export default function CreateReceipt() {
    return <Page>
        <ReceiptForm type="create" mutationMethod={createReceipt}/>
    </Page>
}