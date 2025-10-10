import { transporter } from "../config/nodemailer";

export default async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!email) {
      throw new Error("Recipient email address is missing.");
    }

    await transporter.sendMail({
      from: `"Etrant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Etrant!",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="text-align: center; padding: 20px; background-color: #1a73e8;">
        <img src="https://raw.githubusercontent.com/akhil683/Portfolio_Blogs/refs/heads/main/images/etrant_high.png" alt="Etrant Logo" style="max-width: 120px;" />
      </div>
      
      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #1a73e8; margin-bottom: 10px;">Welcome to Etrant, ${name || "Learner"}</h2>
        <p style="color: #555; line-height: 1.6;">
          We’re excited to have you on board. Etrant transforms learning into a fast, focused, and engaging experience — combining AI-driven curation with a clean, distraction-free format.
        </p>

        <h3 style="color: #333; margin-top: 25px;">Here’s what you can do:</h3>
        <ul style="line-height: 1.6; padding-left: 18px; color: #555;">
          <li><strong>AI-Curated Reels</strong> — Concise summaries from Wikipedia, research papers, and verified news.</li>
          <li><strong>Daily Current Affairs</strong> — Perfect for UPSC and other competitive exams.</li>
          <li><strong>Interactive Knowledge Maps</strong> — Explore topics visually and track your progress.</li>
          <li><strong>Exam-Oriented MCQs</strong> — Practice with targeted, high-quality questions.</li>
          <li><strong>Gamified Learning</strong> — Earn points, badges, and maintain streaks.</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wiki.akkhil.dev" 
            style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
            Start Learning
          </a>
        </div>

        <p style="font-size: 10px; color: #777; line-height: 1.4;">
          This is the beginning of your learning journey with Etrant.  
          We look forward to seeing your progress and helping you achieve your goals.
        </p>

        <p style="font-size: 10px; color: #777; margin-top: 10px;">
          – The Etrant Team
        </p>
      </div>
    </div>
  </div>
`,
    });

    console.log(`✅ Welcome email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    return { success: false, error: (error as Error).message };
  }
}
