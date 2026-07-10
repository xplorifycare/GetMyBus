import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role, message } = body;

    // 1. Basic validation
    if (!name || !email || !phone || !role || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      name,
      email,
      phone,
      role,
      message,
      timestamp: new Date().toISOString(),
    };

    // ==========================================
    // CHANNEL 1: SAVE TO VERCEL KV (REDIS) OR LOCAL FILE
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
          body: JSON.stringify(["LPUSH", "inquiries", JSON.stringify(newInquiry)]),
        });

        if (response.ok) {
          console.log("💾 Inquiry saved persistently to Vercel KV Redis");
        } else {
          console.error("Vercel KV save failed status:", response.status);
        }
      } catch (kvError) {
        console.error("Vercel KV save error:", kvError);
      }
    } else {
      // Local fallback (works during dev)
      try {
        const dbPath = path.join(process.cwd(), "inquiries.json");
        let inquiries = [];

        if (fs.existsSync(dbPath)) {
          const fileContent = fs.readFileSync(dbPath, "utf8");
          inquiries = JSON.parse(fileContent || "[]");
        }

        inquiries.push(newInquiry);
        fs.writeFileSync(dbPath, JSON.stringify(inquiries, null, 2), "utf8");
        console.log("📁 Inquiry saved locally to inquiries.json");
      } catch (fsError) {
        console.error("Local database save error:", fsError);
      }
    }

    // ==========================================
    // CHANNEL 2: TELEGRAM BOT NOTIFICATION
    // ==========================================
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      try {
        const text = `🔔 *New GetMyBus Partnership Request!*\n\n` +
          `*Name:* ${name}\n` +
          `*Email:* ${email}\n` +
          `*Phone:* ${phone}\n` +
          `*Role:* ${role.toUpperCase()}\n` +
          `*Message:* _${message}_`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: "Markdown",
          }),
        });
        console.log("✈️ Notification sent to Telegram");
      } catch (err) {
        console.error("Telegram notification failed:", err);
      }
    }

    // ==========================================
    // CHANNEL 3: SLACK WEBHOOK NOTIFICATION
    // ==========================================
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔔 *New GetMyBus Partnership Request!*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Role:* ${role}\n*Message:* _${message}_`
          })
        });
        console.log("💬 Notification sent to Slack");
      } catch (err) {
        console.error("Slack notification failed:", err);
      }
    }

    // ==========================================
    // CHANNEL 4: DISCORD WEBHOOK NOTIFICATION
    // ==========================================
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
      try {
        await fetch(discordUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "GetMyBus Lead Bot",
            avatar_url: "https://getmybus.in/logo.png",
            embeds: [
              {
                title: "🔔 New Partnership Request",
                color: 65791, // Branded Blue
                fields: [
                  { name: "Name", value: name, inline: true },
                  { name: "Role / Segment", value: role.toUpperCase(), inline: true },
                  { name: "Email", value: email, inline: false },
                  { name: "Phone", value: phone, inline: false },
                  { name: "Message", value: message }
                ],
                timestamp: new Date().toISOString()
              }
            ]
          })
        });
        console.log("👾 Notification sent to Discord");
      } catch (err) {
        console.error("Discord notification failed:", err);
      }
    }

    // ==========================================
    // CHANNEL 5: EMAIL DELIVERY VIA WEB3FORMS
    // ==========================================
    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3formsKey) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New Lead: ${name} (${role})`,
            from_name: "GetMyBus Portal",
            name,
            email,
            phone,
            role,
            message,
            replyto: email
          })
        });

        if (response.ok) {
          console.log("✉️ Email dispatch queued via Web3Forms");
        } else {
          console.error("Web3Forms email delivery failed status:", response.status);
        }
      } catch (err) {
        console.error("Web3Forms API call failed:", err);
      }
    }

    return NextResponse.json(
      { success: true, message: "Inquiry received successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
