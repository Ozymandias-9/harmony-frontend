"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import Page from "@/app/components/Page";
import ReceiptForm from "../../ReceiptForm";
import { getReceiptById, updateReceiptById } from "@/data/receipts";
import { receiptFormSchema } from "@/data/schemas/receipt";

export default function EditReceipt() {
    const { id } = useParams();
    const receiptId = parseInt((id ?? '0').toString());
    const [receipt, setReceipt] = useState<undefined | z.infer<typeof receiptFormSchema>>(undefined);

    useEffect(() => {
        if (receiptId) {
            async function init() {
                const result = (await getReceiptById(receiptId))[0];
                setReceipt({ ...result, creationDate: new Date(result.creationDate)
                });
            }

            init();
        }
    }, [])

    if (receipt !== undefined) {
        return <Page>
            <ReceiptForm type="edit" defaultValues={receipt} mutationMethod={(data: any) => updateReceiptById(receiptId, data)}/>
        </Page>
    }
}