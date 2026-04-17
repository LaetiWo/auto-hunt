import { object, string, preprocess } from "zod";

export const signupSchema = object({
  name: string().min(1, {
    message: "Le nom est requis",
  }),
  email: string()
    .email({
      message: "Veuillez entrer une adresse email valide",
    })
    .min(1, {
      message: "L'email est requis",
    }),

  password: string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères",
  }),
});

export const loginSchema = object({
  email: string()
    .email({
      message: "Veuillez entrer une adresse email valide",
    })
    .min(1, {
      message: "L'email est requis",
    }),
  password: string().min(1, {
    message: "Le mot de passe est requis",
  }),
});
