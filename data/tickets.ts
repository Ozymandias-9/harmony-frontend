import { ApiCall } from "./api-call";

async function getTickets() {
    return await (new ApiCall()).get('tickets').send();
}

async function createTicket(body: any) {
    return await (new ApiCall()).post('tickets').send(body);
}

async function getTicketById(id: number) {
    return await (new ApiCall()).get(`tickets/${id}`).send();
}

async function updateTicketById(id: number, body: any) {
    return await (new ApiCall()).put(`tickets/${id}`).send(body);
}

async function deleteTicketById(id: number) {
    return await (new ApiCall()).delete(`tickets/${id}`).send();
}

export {
    getTickets,
    createTicket,
    getTicketById,
    updateTicketById,
    deleteTicketById,
}