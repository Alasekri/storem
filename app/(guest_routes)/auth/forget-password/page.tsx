"use client";
import React from "react";
import FormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast } from "react-toastify";
import { filterFormikErrors } from "@/app/Utils/formikHelpers";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("الرجاء كتابة صيغة البريد الإلكتروني example@example.example")
    .required("البريد الإلكتروني مطلوب"),
});

export default function ForgetPassword() {
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);
      const res = await fetch("/api/users/forget-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const { message, error } = await res.json();

      if (res.ok) {
        toast.success(message);
      }

      if (!res.ok && error) {
        toast.error(error);
      }
      actions.setSubmitting(false);
    },
  });
  
  const errorsToRender = filterFormikErrors(errors, touched, values);

  type valueKeys = keyof typeof values;

  const { email } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <FormContainer title="يرجى إدخال بريدك الإلكتروني" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="البريد الإلكتروني"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        ارسال الرابط
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin">الدخول</Link>
        <Link href="/auth/signup">التسجيل</Link>
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
    </FormContainer>
  );
}
