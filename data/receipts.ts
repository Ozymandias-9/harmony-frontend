import { ApiCall } from "./api-call";

async function getReceipts() {
    return await (new ApiCall()).get('receipts').send();
}

async function createReceipt(body: any) {
    return await (new ApiCall()).post('receipts').send(body);
}

async function getReceiptById(id: number) {
    return await (new ApiCall()).get(`receipts/${id}`).send();
}

async function updateReceiptCategory(receiptId: number, categoryId: number) {
    return await (new ApiCall()).put(`receipts/${receiptId}/category/${categoryId}`).send();
}

async function deleteReceiptById(id: number) {
    return await (new ApiCall()).delete(`receipts/${id}`).send();
}

async function updateReceiptById(id: number, body: any) {
    return await (new ApiCall()).put(`receipts/${id}`).send(body);
}

async function disconnectCategoryFromReceipt(receiptId: number, categoryId: number) {
    return await (new ApiCall()).delete(`receipts/${receiptId}/category/${categoryId}`).send();
}

export {
    getReceipts,
    createReceipt,
    getReceiptById,
    updateReceiptById,
    deleteReceiptById,
    updateReceiptCategory,
    disconnectCategoryFromReceipt,
}