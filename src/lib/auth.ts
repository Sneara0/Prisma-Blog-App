import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

/* ---------------- SMTP CONFIG ---------------- */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER!,
    pass: process.env.APP_PASS!,
  },
});

/* ---------------- AUTH CONFIG ---------------- */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  /* ---------------- EMAIL VERIFICATION ---------------- */
  emailVerification: {
    sendOnSignUp: true,
     autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      try {
        await transporter.sendMail({
          from: '"Prisma Blog" <yourgmail@gmail.com>',
          to: user.email,
          subject: "Verify your email",
          html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#f4f6f8;font-family:Arial">

<table align="center" width="600" style="background:#fff;border-radius:8px;padding:30px">
  <tr>
    <td align="center">
      <h2>Verify Your Email</h2>
    </td>
  </tr>

  <tr>
    <td>
      <p>Hello ${user.name ?? "User"},</p>
      <p>Welcome to <strong>Prisma Blog</strong>.</p>
      <p>Please confirm your email address by clicking the button below.</p>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:20px">
      <a href="${url}"
         style="background:#2563eb;color:#fff;padding:12px 24px;
                text-decoration:none;border-radius:6px;font-weight:bold">
        Verify Email
      </a>
    </td>
  </tr>

  <tr>
    <td style="font-size:12px;color:#777">
      <p>If the button doesn’t work, copy this link:</p>
      <p style="word-break:break-all">
        <a href="${url}">${url}</a>
      </p>
    </td>
  </tr>

  <tr>
    <td align="center" style="font-size:12px;color:#999;padding-top:20px">
      © ${new Date().getFullYear()} Prisma Blog
    </td>
  </tr>
</table>

</body>
</html>
          `,
        });

        console.log("Verification email sent:", user.email);
      } catch (error) {
        console.error("Failed to send verification email", error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline", 
        prompt: "select_account consent", 
    },
}
});
