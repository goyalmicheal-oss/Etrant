import { transporter } from "../config/nodemailer";

export default async function sendSubscriptionEmail(
  email: string | null,
  name: string | null,
  plan: string | null,
) {
  try {
    if (!email) {
      throw new Error("Recipient email address is missing.");
    }

    await transporter.sendMail({
      from: `"Etrant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎉 Welcome to Etrant ${plan || "Subscription"}!`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="text-align: center; padding: 20px; background-color: #1a73e8;">
        <img src="https://raw.githubusercontent.com/akhil683/Etrant/refs/heads/main/public/etrant.png" alt="Etrant Logo" style="max-width: 120px;" />
      </div>
      
      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #1a73e8; margin-bottom: 10px;">
          Thank you for subscribing, ${name || "Learner"}!
        </h2>
        <p style="color: #555; line-height: 1.6;">
          You’ve successfully upgraded to <strong>Etrant ${plan}</strong>.  
          Your learning journey just got faster, deeper, and more powerful 🚀.
        </p>

        <h3 style="color: #333; margin-top: 25px;">Here’s what you unlocked:</h3>
        <ul style="line-height: 1.6; padding-left: 18px; color: #555;">
          <li><strong>Unlimited AI Reels</strong> — No limits, dive deep into any topic.</li>
          <li><strong>Ad-Free Experience</strong> — 100% focus on learning.</li>
          <li><strong>Premium Knowledge Maps</strong> — Explore advanced connections between topics.</li>
          <li><strong>Exclusive Pro/Max MCQs</strong> — Higher quality, exam-ready questions.</li>
          <li><strong>Priority Updates</strong> — Be the first to access new features.</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wiki.akkhil.dev" 
            style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
            Explore Your ${plan} Features
          </a>
        </div>

        <p style="font-size: 10px; color: #777; line-height: 1.4;">
          We’re committed to making your preparation smarter, faster, and more enjoyable.  
          Thanks for supporting Etrant ❤️
        </p>

        <p style="font-size: 10px; color: #777; margin-top: 10px;">
          – The Etrant Team
        </p>
      </div>
    </div>
  </div>
`,
    });

    console.log(`✅ Subscription email sent to: ${email} (${plan})`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send subscription email to ${email}:`, error);
    return { success: false, error: (error as Error).message };
  }
}
