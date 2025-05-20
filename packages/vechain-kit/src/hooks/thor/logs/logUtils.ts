import {
    EventLogs,
    FilterEventLogsOptions,
    ThorClient,
} from '@vechain/sdk-network';

const MAX_EVENTS_PER_QUERY = 1000;
/**
 * Params for getEvents function
 * @param nodeUrl the node url
 * @param thor the thor client
 * @param auctionId  the auction id to get the events
 * @param order  the order of the events (asc or desc)
 * @param offset  the offset of the events
 * @param limit  the limit of the events (max 256)
 * @param from  the block number to start from
 * @param filterCriteria  the filter criteria for the events
 * @returns  the encoded events
 */
export type GetEventsProps = {
    nodeUrl: string;
    thor: ThorClient;
    order?: 'asc' | 'desc';
    offset?: number;
    limit?: number;
    from?: number;
    to?: number;
    filterCriteria: FilterEventLogsOptions['criteriaSet'];
};
/**
 * Get events from blockchain (auction created, auction successful, auction cancelled)
 * @param order
 * @param offset
 * @param limit
 * @param from block parse start from
 */
export const getEventLogs = async ({
    thor,
    order = 'asc',
    offset = 0,
    limit = MAX_EVENTS_PER_QUERY,
    from = 0,
    to = thor.blocks.getHeadBlock()?.number,
    filterCriteria,
}: GetEventsProps) => {
    const response = await thor.logs.filterEventLogs({
        range: {
            from,
            to,
            unit: 'block',
        },
        options: {
            offset,
            limit,
        },
        order,
        criteriaSet: filterCriteria,
    });

    if (!response) throw new Error('Failed to fetch events');

    return response;
};

/**
 *  call getEvents iteratively to get all the events
 * @param nodeUrl the node url
 * @param thor the thor client
 * @param order the order of the events (asc or desc)
 * @param from the block number to start from
 * @param filterCriteria the filter criteria for the events
 * @returns all the events from the blockchain
 */
export const getAllEventLogs = async ({
    nodeUrl,
    thor,
    order = 'asc',
    from = 0,
    to,
    filterCriteria,
}: Omit<GetEventsProps, 'offset' | 'limit'>) => {
    const allEvents: EventLogs[] = [];
    let offset = 0;
    //return from the function only when we get all the events
    // TODO: check this can be improved, possible infinite loop here
    while (true) {
        const events = await getEventLogs({
            nodeUrl,
            thor,
            filterCriteria,
            from,
            to: to ?? Number.MAX_SAFE_INTEGER,
            limit: MAX_EVENTS_PER_QUERY,
            order,
            offset,
        });
        allEvents.push(...events);
        if (events.length < MAX_EVENTS_PER_QUERY) {
            return allEvents;
        }
        offset += MAX_EVENTS_PER_QUERY;
    }
};
