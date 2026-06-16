import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少需要 8 位"),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(8, "确认密码至少需要 8 位"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });
