import { ApiCall } from "./api-call";

async function getCategories(params?: any) {
    return await (new ApiCall()).get('categories').send({}, { params });
}

async function createCategory(body: any) {
    return await (new ApiCall()).post('categories').send(body);
}

async function updateCategoryById(id: number, body: any) {
    return await (new ApiCall()).patch(`categories/${id}`).send(body);
}

async function deleteCategoryById(id: number) {
    return await (new ApiCall()).delete(`categories/${id}`).send();
}

export {
    getCategories, createCategory, updateCategoryById, deleteCategoryById
}