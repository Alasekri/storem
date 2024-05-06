import startDb from "@/app/lib/db"
import UserModel from "@/app/models/userModle"
import { SignInCredentials } from "@/app/types"
import { avatar } from "@material-tailwind/react"
import { NextResponse } from "next/server"

export const POST = async (req: Request) =>{
    const {email , password} = await req.json() as SignInCredentials 
    if(!email || !password) return NextResponse.json({error:'خطأ في الطلب'})

    await startDb()
    
    const user = await UserModel.findOne({email})

    if(!user) return NextResponse.json({error:'خطأ في الدخول'})

    const passwordMatch = await user.comparePassword(password)
    if(!passwordMatch) return NextResponse.json({error:'خطأ في الدخول'})

    return NextResponse.json({user:user._id.tostring(), name:user.name , avatar:user.avatar?.url , role:user.role})


}