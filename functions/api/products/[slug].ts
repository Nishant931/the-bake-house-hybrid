import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export const onRequest: PagesFunction = async (context) => {
  const { request, env, params } = context;

  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  try {
    if (request.method === "GET") {
      const slug = params.slug as string;

      const product = await prisma.product.findUnique({
        where: { slug },
        include: { images: true, variants: true, category: true },
      });

      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(product), {
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
