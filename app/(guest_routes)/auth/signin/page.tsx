"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import AuthFormContainer from "@components/AuthFormContainer";
import { filterFormikHelpers } from "@/app/utils/formikHelpers";
import React from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const validationSchema = yup.object().shape({
  email: yup.string().email("الرجاء كتابة صيغة البريد الإلكتروني example@example.example")
  .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب ان تكون على الأقل 8 حروف")
    .required("كلمة المرور مطلوبة"),
});

export default function SignIn() {
  const router = useRouter();
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      const signInRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signInRes?.error === "CredentialsSignin") {
        toast.error("كلمة المرور أو إسم المستخدم غير صحيح");
      }

      if (!signInRes?.error) {
        router.refresh();
      }
    },
  });

  const errorsToRender = filterFormikHelpers(errors, touched, values);

  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="تسجيل الدخول" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="البريد الإلكتروني"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
      />
      <Input
        name="password"
        label="كلمة المرور"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        دخول
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">التسجيل</Link>
        <Link href="/auth/forget-password">نسيت كلمة المرور</Link>
      </div>
      <div className="">
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
