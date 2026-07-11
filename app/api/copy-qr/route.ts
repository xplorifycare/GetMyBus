import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const src = "c:\\Users\\jassi\\Desktop\\bus-tracking\\gmb_qr.png";
    const dest = path.join(process.cwd(), "public", "gmb_qr.png");
    
    // Ensure public folder exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.copyFileSync(src, dest);
    return NextResponse.json({ 
      success: true, 
      message: "gmb_qr.png copied successfully to public folder!" 
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}
