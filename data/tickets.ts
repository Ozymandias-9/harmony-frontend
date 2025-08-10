import { ApiCall } from "./api-call";

async function getTickets() {
    return await (new ApiCall()).get('tickets').send();
}

async function createTicket(body: any) {
    return await (new ApiCall()).post('tickets').send(body);
}

export {
    getTickets,
    createTicket,
}