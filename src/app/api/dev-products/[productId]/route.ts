import { NextResponse } from "next/server";

import { getDevProductById } from "@/data/dev-products";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  /*
   * Important:
   * Dummy products must NEVER be
   * available outside local development.
   *
   * Vercel Preview/Production uses
   * NODE_ENV=production.
   */
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        product: null,
      },
      {
        status: 404,
      },
    );
  }

  const { productId } = await context.params;

  const product = getDevProductById(decodeURIComponent(productId));

  if (!product) {
    return NextResponse.json(
      {
        product: null,
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    product,
  });
}
