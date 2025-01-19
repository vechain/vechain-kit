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
    thor: Connex.Thor;
    order?: 'asc' | 'desc';
    offset?: number;
    limit?: number;
    from?: number;
    to?: number;
    filterCriteria: Connex.Thor.Filter.Criteria<'event'>[];
};
/**
 * Get events from blockchain (auction created, auction successful, auction cancelled)
 * @param order
 * @param offset
 * @param limit
 * @param from block parse start from
 */
export const getEvents = async ({
    nodeUrl,
    thor,
    order = 'asc',
    offset = 0,
    limit = MAX_EVENTS_PER_QUERY,
    from = 0,
    to = thor.status.head.number,
    filterCriteria,
}: GetEventsProps): Promise<Connex.Thor.Filter.Row<'event'>[]> => {
    // Send tx details to the node to get the gas estimate
    const response = await fetch(`${nodeUrl}/logs/event`, {
        method: 'POST',
        body: JSON.stringify({
            range: {
                from,
                to,
                unit: 'block',
            },
            options: {
                offset,
                limit,
            },
            criteriaSet: filterCriteria,
            order,
        }),
    });

    if (!response.ok) throw new Error('Failed to fetch events');

    const outputs = (await response.json()) as Connex.Thor.Filter.Row<
        'event',
        {}
    >[];
    return outputs;
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
export const getAllEvents = async ({
    nodeUrl,
    thor,
    order = 'asc',
    from = 0,
    to,
    filterCriteria,
}: Omit<GetEventsProps, 'offset' | 'limit'>) => {
    const allEvents: Connex.Thor.Filter.Row<'event', {}>[] = [];
    let offset = 0;

    // thor.block("best").get() is not working, have to use the node directly
    //   const bestBlock = await fetch(`${appConfig.nodeUrl}/blocks/best`)
    //   const bestBlockJson = (await bestBlock.json()) as Connex.Thor.Block

    to = to ?? Number.MAX_SAFE_INTEGER;

    //return from the function only when we get all the events
    while (true) {
        const events = await getEvents({
            nodeUrl,
            thor,
            filterCriteria,
            from,
            to,
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
