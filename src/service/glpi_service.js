import urls from "../repositories/urlsRep.js";
import glpi_client from "../clients/glpi_client.js";
import ticketMapper from "../mappers/ticketMapper.js";

class GlpiTickets {
    constructor() {
        this.glpiTicketStatus = {
            "novo": 1,
            "atribuido": 2,
            "planejado": 3,
            "pendente": 4,
            "solucionado": 5,
            "atrasado": 7,
        };
    }

    async getGlpiTickets(status) {
        const urlStatus = this.glpiTicketStatus[status];
        const endPoint = urls.requestGlpiEndpointByStatus(urlStatus);

        const result = await glpi_client.glpiRequestData(endPoint, "GET");

        // Tenta extrair o array de tickets (pode vir direto ou dentro de .data)
        const ticketsArray = Array.isArray(result) ? result : (result?.data && Array.isArray(result.data) ? result.data : null);

        if (!ticketsArray) {
            console.warn(`Aviso: GLPI retornou formato inesperado para status ${status}:`, result);
            return [];
        }

        const processedTickets = ticketMapper.processTickets(ticketsArray);

        // Se a busca foi especificamente por "atrasado", adicionamos a flag sem sobrescrever o status
        if (status === "atrasado") {
            return processedTickets.map(ticket => ({
                ...ticket,
                isAtrasado: true
            }));
        }

        return processedTickets;
    }

    async getTicketsByStatus(status) {
        const glpiTickets = await this.getGlpiTickets(status.toLowerCase());

        if (!glpiTickets || glpiTickets.length === 0) {
            return [];
        }

        return this.addTechniciansToTickets(glpiTickets);
    }

    async getTicketsForBi(startDate, endDate) {
        const statusKeys = Object.keys(this.glpiTicketStatus);

        const ticketsByStatus = await Promise.all(
            statusKeys.map((statusKey) => this.getGlpiTickets(statusKey))
        );

        // Mescla todos os resultados no Map
        const allFetched = ticketsByStatus.flat();
        console.log(`Backend: Total bruto coletado: ${allFetched.length} tickets.`);

        const ticketsMap = new Map();
        allFetched.forEach(ticket => {
            if (!ticket || !ticket.ticketId) return;
            const existing = ticketsMap.get(ticket.ticketId);
            if (existing) {
                ticketsMap.set(ticket.ticketId, {
                    ...existing,
                    ...ticket,
                    isAtrasado: existing.isAtrasado || ticket.isAtrasado
                });
            } else {
                ticketsMap.set(ticket.ticketId, ticket);
            }
        });

        const allTickets = Array.from(ticketsMap.values());

        let filteredTickets = allTickets;

        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            filteredTickets = allTickets.filter((ticket) => {
                const dataCriacao = new Date(ticket.dataCriacao);

                if (Number.isNaN(dataCriacao.getTime())) {
                    return false;
                }

                if (start && dataCriacao < start) {
                    return false;
                }

                if (end) {
                    const endInclusive = new Date(end);
                    endInclusive.setHours(23, 59, 59, 999);

                    if (dataCriacao > endInclusive) {
                        return false;
                    }
                }

                return true;
            });
        }

        // adiciona nome dos técnicos de forma otimizada
        return this.addTechniciansToTickets(filteredTickets);
    }

    async addTechniciansToTickets(tickets) {

        // coleta IDs únicos de técnicos
        const technicianIds = [
            ...new Set(
                tickets
                    .map((ticket) => ticket.idTecnicoAtribuido)
                    .filter(Boolean)
            ),
        ];

        // busca técnicos
        const techniciansResponses = await Promise.all(
            technicianIds.map(async (id) => {
                try {
                    const user = await glpi_client.glpiRequestData(`/user/${id}`);
                    // O cliente agora retorna os dados diretamente em 'user'
                    return { id, name: user?.name || "Não encontrado" };
                } catch {
                    return { id, name: "Não encontrado" };
                }
            })
        );

        // cria mapa de técnicos
        const techniciansMap = new Map();

        techniciansResponses.forEach((tech) => {
            techniciansMap.set(tech.id, tech.name);
        });

        // adiciona técnico aos tickets
        return tickets.map((ticket) => ({
            ...ticket,
            nomeTecnico:
                techniciansMap.get(ticket.idTecnicoAtribuido) || "Não Atribuido",
        }));
    }
}

export default new GlpiTickets();