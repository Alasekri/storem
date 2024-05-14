import nodemailer from "nodemailer";

type profile = { name: string; email: string };

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cb9426a6659188",
      pass: "313e19c65990b8",
    },
  });
  return transport;
};

const sendEmailForAll = async (profile: profile, linkUrl: string , html:string) => {
  const transport = generateMailTransporter();
  var htmlString = ``

  switch (html) {
    case "verification":
        htmlString = `<h1>الرجاء تأكيد البريد الإلكتروني عبر ضغط <a href="${linkUrl}">هذا الرابط</a> </h1>`
      break;

      case "forget-password":
        htmlString = `<h1>الرجاء الضغط  على <a href="${linkUrl}">هذا الرابط لإعادة تعيين كلمة المرور!</a>  إذ لم تطلب إعادة كلمة المرور لاتقم بشيء</h1>`
      break;

    default:
      break;
  }
  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: htmlString,
  });
};

const sendUpdatePasswordConfiration = async (profile: profile) => {
    const transport = generateMailTransporter();

    await transport.sendMail({
      from: "verification@nextecom.com",
      to: profile.email,
      html: `<h1><a herf="${process.env.SIGN_IN_URL}"> اضغط هنا </a> لتسجيل الدخول تم إعادة تعيين كلمة المرور بنجاح</h1>`
    });
  };

export const sendEmail = (option: EmailOptions) => {
  const { profile, subject, linkUrl } = option;

  switch (subject) {
    case "verification":
        return sendEmailForAll(profile,linkUrl! , 'verification')

      case "forget-password":
        return sendEmailForAll(profile,linkUrl! , 'verification')

      case "password-changed":
        return sendUpdatePasswordConfiration(profile)
  }
};
