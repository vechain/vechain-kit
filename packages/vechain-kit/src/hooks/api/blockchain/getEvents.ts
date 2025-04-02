import { ThorClient, FilterRawEventLogsOptions } from '@vechain/sdk-network';

const MAX_EVENTS_PER_QUERY = 1000;

/**
 * Params for getEvents function
 */
export type GetEventsProps = {
    thor: ThorClient;
    order?: 'asc' | 'desc';
    offset?: number;
    limit?: number;
    from?: number;
    to?: number;
    filterCriteria: any[]; // Replace with your specific criteria type
};

/**
 * Get events from blockchain
 */
export const getEvents = async ({
    thor,
    order = 'asc',
    offset = 0,
    limit = MAX_EVENTS_PER_QUERY,
    from = 0,
    to,
    filterCriteria,
}: GetEventsProps) => {
    // Create filter options with the correct type
    const filterOptions: FilterRawEventLogsOptions = {
        range: {
            unit: 'block',
            from,
            to: to || undefined,
        },
        options: {
            offset,
            limit,
        },
        criteriaSet: filterCriteria,
        order,
    };

    // Use the SDK's logs module to filter event logs
    return await thor.logs.filterRawEventLogs(filterOptions);
};

/**
 * Get all events iteratively
 */
export const getAllEvents = async ({
    thor,
    order = 'asc',
    from = 0,
    to,
    filterCriteria,
}: Omit<GetEventsProps, 'offset' | 'limit'>) => {
    const allEvents = [];
    let offset = 0;

    // Get the best block if to is not provided
    if (!to) {
        const bestBlock = await thor.blocks.getBestBlockCompressed();
        if (!bestBlock) {
            throw new Error('Failed to get best block');
        }
        to = bestBlock.number;
    }

    // Fetch all events iteratively
    while (true) {
        const events = await getEvents({
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
