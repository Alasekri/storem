import { NewUserRequest } from "@/app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModle";
import { NextResponse } from "next/server"
import nodemailer from 'nodemailer';
export const POST = async (req:Request) => {
    const body = await req.json() as NewUserRequest
    await startDb();
    const newUser = await UserModel.create({
        ...body
    })
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "cb9426a6659188",
          pass: "313e19c65990b8"
        }
      });

      transport.sendMail({
        from: 'verification@nextecom.com',
        to: newUser.email,
        html: '<h1>الرجاء تأكيد البريد الإلكتروني عبر ضغط <a href="http://localhost:3000/auth/signup">هذا الرابط</a> </h1>'
      })
    return NextResponse.json(newUser);
};