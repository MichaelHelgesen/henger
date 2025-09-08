// pages/api/products.xml.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Builder } from 'xml2js';
import { sanityClient } from '../../sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Hent alle produkter fra Sanity
    const query = `*[_type == "product"]{
      _id,
      title,
      sku,
      description,
      price,
      inStock,
      weight,
      dimensions,
      attributes[]{
        name,
        value
      },
      images[]{
        asset->{
          url
        }
      }
    }`;

    const products = await sanityClient.fetch(query);

    // Map produkter til XML-struktur
    const data = {
      catalog: {
        product: products.map((p: any) => ({
          $: { id: p._id },
          name: p.title,
          sku: p.sku,
          description: p.description,
          price: { _: p.price, $: { currency: 'NOK' } },
          inStock: p.inStock,
          weight: p.weight,
          dimensions: {
            width: p.dimensions?.width,
            height: p.dimensions?.height,
            depth: p.dimensions?.depth,
          },
          attributes: {
            attribute: (p.attributes || []).map((a: any) => ({
              _: a.value,
              $: { name: a.name },
            })),
          },
          images: {
            image: (p.images || []).map((img: any) => ({
              _: img.asset.url,
              $: { type: 'main' },
            })),
          },
        })),
      },
    };

    // Bygg XML
    const builder = new Builder({ headless: true });
    const xml = builder.buildObject(data);

    // Returner XML med riktig Content-Type
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Feil ved generering av XML:', error);
    res.status(500).send('Feil ved generering av XML');
  }
}
