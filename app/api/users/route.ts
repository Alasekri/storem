import EmailVerificationToken from "@/app/models/emailVerificationToken";
import { NewUserRequest } from "@/app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModle";
import { NextResponse } from "next/server"
import nodemailer from 'nodemailer';
import crypto from 'crypto';
export const POST = async (req:Request) => {
    const body = (await req.json()) as NewUserRequest
    await startDb();


    const newUser = await UserModel.create({
        ...body,
    });
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "cb9426a6659188",
          pass: "313e19c65990b8"
        }
      });

      const token = await crypto.randomBytes(36).toString('hex');

      await EmailVerificationToken.create({
            user: newUser._id,
            token:token,
        });

      const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`

      transport.sendMail({
        from: 'verification@nextecom.com',
        to: newUser.email,
        html: `<h1>الرجاء تأكيد البريد الإلكتروني عبر ضغط <a href="${verificationUrl}">هذا الرابط</a> </h1>`
      });
    return NextResponse.json({message: "الرجاء التحقق من البريد الإلكتروني الخاص بك."});
};





