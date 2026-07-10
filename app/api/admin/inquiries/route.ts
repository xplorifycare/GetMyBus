import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Fallback during local development

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let inquiries = [];

    // ==========================================
    // READ FROM VERCEL KV (REDIS) OR LOCAL FILE
    // ==========================================
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (kvUrl && kvToken) {
      try {
        const response = await fetch(kvUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["LRANGE", "inquiries", "0", "-1"]),
        });

        if (response.ok) {
          const data = await response.json();
          // Vercel KV REST response format for command is in result key: { result: [...] }
          const rawList = data.result || [];
          inquiries = rawList.map((item: string) => {
            try {
              return JSON.parse(item);
            } catch {
              return item;
            }
          });
          console.log("💾 Read inquiries successfully from Vercel KV Redis");
        } else {
          console.error("Vercel KV read failed status:", response.status);
        }
      } catch (kvError) {
        console.error("Vercel KV read error:", kvError);
      }
    } else {
      // Local fallback during dev
      try {
        const dbPath = path.join(process.cwd(), "inquiries.json");
        if (fs.existsSync(dbPath)) {
          const fileContent = fs.readFileSync(dbPath, "utf8");
          inquiries = JSON.parse(fileContent || "[]");
          // Sort newest first since LPUSH prepends them in Redis
          inquiries.reverse();
        }
      } catch (fsError) {
        console.error("Local database read error:", fsError);
      }
    }

    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error) {
    console.error("Admin API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
