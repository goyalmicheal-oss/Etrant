// import { google } from "googleapis";
// import { auth } from "@/auth";

export async function POST(req: Request) {
  // const session = await auth();
  // if (!session) return new Response("Unauthorized", { status: 401 });
  //
  // const { title, description, start, end } = await req.json();
  // const google_auth = new google.auth.OAuth2();
  // google_auth.setCredentials({ access_token: session.accessToken });
  //
  // const calendar = google.calendar({ version: "v3", auth });
  //
  // // 1️⃣ Search for existing event
  // const existing = await calendar.events.list({
  //   calendarId: "primary",
  //   timeMin: start,
  //   timeMax: end,
  //   q: title, // filter by title
  // });
  //
  // if (existing.data.items && existing.data.items.length > 0) {
  //   return new Response("Event already exists", { status: 200 });
  // }
  //
  // await calendar.events.insert({
  //   calendarId: "primary",
  //   requestBody: {
  //     summary: title,
  //     description,
  //     start: { dateTime: start, timeZone: "Asia/Kolkata" },
  //     end: { dateTime: end, timeZone: "Asia/Kolkata" },
  //   },
  // });
  //
  return new Response("Event added", { status: 200 });
}
