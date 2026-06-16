import { z } from "zod";

export const profileSettingsSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, "请输入昵称")
    .max(30, "昵称最多 30 个字"),
});

export const emailRebindSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址"),
});

export const passwordChangeSchema = z
  .object({
    password: z.string().min(8, "新密码至少需要 8 位"),
    confirmPassword: z.string().min(8, "确认密码至少需要 8 位"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的新密码不一致",
    path: ["confirmPassword"],
  });

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type EmailRebindValues = z.infer<typeof emailRebindSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
