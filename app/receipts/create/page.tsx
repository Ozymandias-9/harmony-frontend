"use client"

import Page from "@/app/components/Page";
import ReceiptForm from "@/app/components/receipts/ReceiptForm";
import { createReceipt } from "@/data/receipts";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function CreateReceipt() {
    return <Page title="Receipts">
        <Breadcrumb items={[{ value: "Receipts", link: { href: "/receipts"} }]} />
        <ReceiptForm type="create" mutationMethod={createReceipt}/>
    </Page>
}