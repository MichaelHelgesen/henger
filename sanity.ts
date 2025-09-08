
// sanity.ts
import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: "k6uatcre", // bytt ut med prosjekt-ID fra Sanity
  dataset: "production",     // typisk "production"
  useCdn: false,                // false for fersk data
  apiVersion: "2023-01-01",     // dato for Sanity API-versjon
});
