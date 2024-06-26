"use client";
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { filterFormikErrors } from "@/app/Utils/formikHelpers";

const validationSchema = yup.object().shape({
  name: yup.string().required("الإسم مطلوب"),
  email: yup
    .string()
    .email("الرجاء كتابة صيغة البريد الإلكتروني example@example.example")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب ان تكون على الأقل 8 حروف")
    .required("كلمة المرور مطلوبة"),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };

      if (res.ok) {
        toast.success(message);
        await signIn("credentials", { email, password });
      }

      if (!res.ok && error) {
        toast.error(error);
      }
      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  const { email, name, password } = values;
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="إنشاء حساب" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="الإسم"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
        error={error("name")}
      />
      <Input
        name="email"
        label="البريد الإلكتروني"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
        error={error("email")}
      />
      <Input
        name="password"
        label="كلمة المرور"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
        error={error("password")}
      />
      <Button disabled={isSubmitting} type="submit" className="w-full">
        تسجيل
      </Button>
      <div className="flex items-center justify-between">
        <p>
          {" "}
          لديك حساب بالفعل ؟ <Link href="/auth/signin"> تسجيل الدخول </Link>
        </p>
      </div>
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
