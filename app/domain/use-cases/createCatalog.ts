import { Catalog, Registration } from "../entities";

export interface ICatalogClient {
  registerCatalog(catalog: Catalog): Promise<string>;
}

export async function createCatalog(
  registrations: Registration[],
  catalogClient: ICatalogClient
): Promise<Registration> {
  if (registrations.length === 0) {
    throw new Error('No registrations to catalog');
  }

  const catalog: Catalog = {
    registrations: registrations.map(r => ({
      nid: r.nid,
      timestamp: r.timestamp,
      imageData: r.imageData,
    })),
    totalCount: registrations.length,
    createdAt: new Date().toISOString(),
  };

  const catalogNid = await catalogClient.registerCatalog(catalog);

  return {
    nid: catalogNid,
    timestamp: catalog.createdAt,
  };
}