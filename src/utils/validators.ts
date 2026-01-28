import * as z from "zod";

export const createPropertySchema = z.object({
    city: z.string().min(1, "City can't be null"),
    street: z.string().min(1, "street can't be null"),
    state: z.string().length(2, "State has to be 2 characters long"),
    zipCode: z.string().regex(/^\d{5}$/, "zip code must be 5 digits long")


})