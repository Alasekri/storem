"use client";
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {useFormik} from "formik";
import * as yup from 'yup';
import { filterFormikHelpers } from "@/app/Utils/formikHelpers";

const validationSchema = yup.object().shape({
  name: yup.string().required("الإسم مطلوب"),
  email: yup.string().email("الرجاء كتابة صيغة البريد الإلكتروني example@example.example").required("البريد الإلكتروني مطلوب"),
  password: yup.string().min(8 , "كلمة المرور يجب ان تكون على الأقل 8 حروف").required("كلمة المرور مطلوبة"),

})

export default function SignUp() {
  const {values , handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched} = useFormik({
    initialValues: {name:'' , email:'', password:''},
    validationSchema,
    onSubmit:(values)=>{
      console.log(values)
    }
  })

  const formErrors: string[] = filterFormikHelpers(errors,touched,values)

  console.log(errors)

  const {email,name,password} = values

  return (
    <AuthFormContainer title="إنشاء حساب" onSubmit={handleSubmit}>
      <Input name="name" label="الإسم" onChange={handleChange} value={name} onBlur={handleBlur}/>
      <Input name="email" label="البريد الإلكتروني" onChange={handleChange} value={email} onBlur={handleBlur}/>
      <Input name="password" label="كلمة المرور" type="password" onChange={handleChange} value={password} onBlur={handleBlur}/>
      <Button type="submit" className="w-full">
        تسجيل
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}