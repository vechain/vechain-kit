import { z } from "zod"

export const TotalImpactSchema = z.object({
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
  education_time: z.number().optional(),
  trees_planted: z.number().optional(),
  calories_burned: z.number().optional(),
  clean_energy_production_wh: z.number().optional(),
  sleep_quality_percentage: z.number().optional(),
})
