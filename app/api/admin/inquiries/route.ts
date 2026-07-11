import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let inquiries = [];
    let isSupabaseLoaded = false;

    // ==========================================
    // READ FROM SUPABASE (POSTGREST HTTP API)
    // ==========================================
    const supabaseUrl = process.env.STORAGE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.STORAGE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.STORAGE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/inquiries?select=*&order=timestamp.desc`, {
          method: "GET",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          inquiries = await response.json();
          console.log("💾 Read inquiries successfully from Supabase!");
          isSupabaseLoaded = true;
        } else {
          const errText = await response.text();
          console.error("Supabase REST load failed status:", response.status, errText);
        }
      } catch (sbError) {
        console.error("Supabase REST load error:", sbError);
      }
    }

    // ==========================================
    // FALLBACK 1: READ FROM VERCEL KV (REDIS)
    // ==========================================
    if (!isSupabaseLoaded) {
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
            const rawList = data.result || [];
            inquiries = rawList.map((item: string) => {
              try {
                return JSON.parse(item);
              } catch {
                return item;
              }
            });
            console.log("💾 Read inquiries successfully from Vercel KV Redis");
            isSupabaseLoaded = true; // Flag true to skip local fallback
          } else {
            console.error("Vercel KV read failed status:", response.status);
          }
        } catch (kvError) {
          console.error("Vercel KV read error:", kvError);
        }
      }
    }

    // ==========================================
    // FALLBACK 2: READ FROM LOCAL FILE
    // ==========================================
    if (!isSupabaseLoaded) {
      try {
        const dbPath = path.join(process.cwd(), "inquiries.json");
        if (fs.existsSync(dbPath)) {
          const fileContent = fs.readFileSync(dbPath, "utf8");
          inquiries = JSON.parse(fileContent || "[]");
          inquiries.reverse(); // Newest first
        }
      } catch (fsError) {
        console.error("Local database read error:", fsError);
      }
    }

    return NextResponse.json(
      { success: true, inquiries },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
