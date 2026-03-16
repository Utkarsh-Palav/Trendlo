import { Resend } from "resend";
import fs from "fs";

// Parse .env.local manually
const envFile = fs.readFileSync(".env.local", "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const [key, ...values] = line.split("=");
  if (key && values.length > 0) {
    env[key.trim()] = values.join("=").trim();
  }
});

const resend = new Resend(env.RESEND_API_KEY);

async function run() {
  console.log("Testing email with key:", env.RESEND_API_KEY ? "Found" : "Not Found");
  console.log("From EMAIL:", env.RESEND_FROM_EMAIL);
  
  try {
    const data = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: "utkarshpalav17@gmail.com", // Assuming this is the owner's email
      subject: "Test Email from Trendlo",
      html: "<p>Verification test for Trendlo Email System.</p>",
    });

    console.log("Response:", data);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

run();
