import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  // Initialize Prisma with D1 adapter
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      const category = url.searchParams.get("category");
      const limit = parseInt(url.searchParams.get("limit") || "20");

      let query: any = {
        take: limit,
        include: { images: true, variants: true },
      };

      if (category) {
        query.where = { category: { slug: category } };
      }

      const products = await prisma.product.findMany(query);

      return new Response(JSON.stringify(products), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
