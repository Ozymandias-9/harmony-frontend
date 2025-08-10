import { ApiCall } from "./api-call";

async function getCategories() {
    return await (new ApiCall()).get('categories').send();
}

async function createCategory(body: any) {
    return await (new ApiCall()).post('categories').send(body);
}

export {
    getCategories, createCategory
}