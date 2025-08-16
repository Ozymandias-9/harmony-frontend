import { ApiCall } from "./api-call";

async function getItems() {
    return await (new ApiCall()).get('items').send();
}

async function createItem(body: any) {
    return await (new ApiCall()).post('items').send(body);
}

async function updateItemsCategory(itemId: number, categoryId: number) {
    return await (new ApiCall()).put(`items/${itemId}/category/${categoryId}`).send();
}

async function deleteItem(itemId: number) {
    return await (new ApiCall()).delete(`items/${itemId}`).send();
}

async function updateItem(itemId: number, body: any) {
    return await (new ApiCall()).put(`items/${itemId}`).send(body);
}

export {
    getItems, createItem, updateItemsCategory, deleteItem, updateItem
}