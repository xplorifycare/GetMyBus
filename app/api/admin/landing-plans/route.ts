import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface LandingPlansConfig {
  selectedPlanIds: string[];
  featuredPlanId?: string;
  updatedAt: string;
}

const DEFAULT_CONFIG: LandingPlansConfig = {
  selectedPlanIds: ["plan_alpha", "plan_beta", "plan_delta", "plan_etm_pos"],
  featuredPlanId: "plan_beta",
  updatedAt: new Date().toISOString(),
};

function getConfigFilePath(): string {
  return path.join(process.cwd(), "landing_plans.json");
}

function readConfig(): LandingPlansConfig {
  try {
    const filePath = getConfigFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.selectedPlanIds) && parsed.selectedPlanIds.length > 0) {
        return {
          selectedPlanIds: parsed.selectedPlanIds,
          featuredPlanId: parsed.featuredPlanId || parsed.selectedPlanIds[0],
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch (error) {
    console.error("Error reading landing_plans.json:", error);
  }
  return DEFAULT_CONFIG;
}

function saveConfig(config: LandingPlansConfig): boolean {
  try {
    const filePath = getConfigFilePath();
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving landing_plans.json:", error);
    return false;
  }
}

export async function GET() {
  try {
    const config = readConfig();
    return NextResponse.json(
      { success: true, config },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/admin/landing-plans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read landing plans configuration" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedPlanIds, featuredPlanId } = body;

    if (!Array.isArray(selectedPlanIds) || selectedPlanIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one plan to display on the landing page." },
        { status: 400 }
      );
    }

    const config: LandingPlansConfig = {
      selectedPlanIds,
      featuredPlanId: featuredPlanId || selectedPlanIds[0],
      updatedAt: new Date().toISOString(),
    };

    const saved = saveConfig(config);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist plans configuration to disk" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, config, message: "Landing page plans updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/admin/landing-plans error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
