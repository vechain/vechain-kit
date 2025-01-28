import { z } from 'zod';

export const SustainabilityActionsResponseSchema = z.object({
    pagination: z.object({
        hasNext: z.boolean(),
    }),
    data: z
        .array(
            z.object({
                blockNumber: z.number(),
                blockTimestamp: z.number(),
                appId: z.string(),
                distributor: z.string(),
                amount: z.number(),
                receiver: z.string(),

                proof: z
                    .object({
                        version: z.number(),
                        description: z.string(),
                        proof: z
                            .object({
                                image: z.string().optional(),
                                link: z.string().optional(),
                                text: z.string().optional(),
                                video: z.string().optional(),
                            })
                            .optional(),
                        impact: z
                            .object({
                                carbon: z.number().optional(),
                                water: z.number().optional(),
                                energy: z.number().optional(),
                                waste_mass: z.number().optional(),
                                waste_items: z.number().optional(),
                                waste_reduction: z.number().optional(),
                                biodiversity: z.number().optional(),
                                people: z.number().optional(),
                                timber: z.number().optional(),
                                plastic: z.number().optional(),
                                learning_time: z.number().optional(),
                            })
                            .optional(),
                    })
                    .optional(),
            }),
        )
        .default([]),
});
