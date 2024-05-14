import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModle";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email)
      return NextResponse.json({ error: "خطأ في البيانات!" }, { status: 401 });

    await startDb();

    const user = await UserModel.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "خطأ في البيانات!" }, { status: 404 });

    //generate token and

    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });

    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    //send it to email

    const resetPassLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forget-password",
      linkUrl: resetPassLink,
    });

    return NextResponse.json({
      message: "الرجاء التحقق من البريد الإلكتروني الخاص بك.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};

// import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
// import UserModel from "@/app/models/userModle";
// import { ForgetPasswordRequest } from "@/app/types";
// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import startDb from "@/app/lib/db";
// // import { sendEmail } from "@/app/lib/email";

// export const POST = async (req: Request) => {
//   try {
//     const { email } = (await req.json()) as ForgetPasswordRequest;
//     if (!email)
//       return NextResponse.json({ error: "Invalid email!" }, { status: 401 });

//     await startDb();
//     const user = await UserModel.findOne({ email });
//     if (!user)
//       return NextResponse.json({ error: "user not found!" }, { status: 404 });

//     // generate the token and send the link to the given email

//     await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
//     const token = crypto.randomBytes(36).toString("hex");
//     await PasswordResetTokenModel.create({
//       user: user._id,
//       token,
//     });

//     // send the link to the given email
//     const resetPassLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;
//     const transport = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//           user: "cb9426a6659188",
//           pass: "313e19c65990b8"
//         }
//       });

//       transport.sendMail({
//         from: 'verification@nextecom.com',
//         to: user.email,
//         html: `<h1>الرجاء الضغط  على <a href="${resetPassLink}">هذا الرابط لإعادة تعيين كلمة المرور , إذ لم تطلب إعادة كلمة المرور لاتقم بشئ!</a> </h1>`
//       });

//     return NextResponse.json({ message: "Please check your email." });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as any).message },
//       { status: 500 }
//     );
//   }
// };
