import { ApiCall } from "./api-call";

async function getItems() {
    return await (new ApiCall()).get('items').send();
}

async function createItem(body: any) {
    return await (new ApiCall()).post('items').send(body);
}

async function updateItemById(id: number, body: any) {
    return await (new ApiCall()).put(`items/${id}`).send(body);
}

async function deleteItemById(id: number) {
    return await (new ApiCall()).delete(`items/${id}`).send();
}

async function updateItemCategory(itemId: number, categoryId: number) {
    return await (new ApiCall()).put(`items/${itemId}/category/${categoryId}`).send();
}

async function disconnectCategoryFromItem(itemId: number, categoryId: number) {
    return await (new ApiCall()).delete(`items/${itemId}/category/${categoryId}`).send();
}

export {
    getItems,
    createItem,
    updateItemById,
    deleteItemById,
    updateItemCategory,
    disconnectCategoryFromItem
}