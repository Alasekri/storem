import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModle";
import { UpdatePasswordRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } =
      (await req.json()) as UpdatePasswordRequest;
    if (!password || !token || !isValidObjectId(userId))
      return NextResponse.json({ error: " 1خطأ في العملية" }, { status: 401 });

    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({ user: userId });
    if (!resetToken)
      return NextResponse.json({ error: "2خطأ في العملية" }, { status: 401 });

    const matched = await resetToken.compareToken(token);
    if (!matched)
      return NextResponse.json({ error: "3خطأ في العملية" }, { status: 401 });

    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json({ error: "4خطأ في العملية" }, { status: 404 });

    const isMactched = await user.comparePassword(password);
    if (isMactched) {
      return NextResponse.json(
        { error: "كلمة المرور الجديدة يجب ان تكون مختلفه" },
        { status: 401 }
      );
    }

    user.password = password;
    await user.save();
    await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);

    sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-changed",
    });

    
      return NextResponse.json({message: "تم إعادة تعيين كلمة المرور بنجاح."});

  } catch (error) {
    return NextResponse.json(
      {
        error: "لايمكن تحديث كلمة المرور ، خطأ في العملية!",
      },
      { status: 500 }
    );
  }
};
