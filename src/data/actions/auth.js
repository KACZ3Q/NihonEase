"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { registerUserService, loginUserService } from "../services/auth";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 tydzień
  path: "/",
  domain: "nihon-ease.vercel.app" ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z.string().min(3, {
    message: "Nazwa użytkownika musi mieć co najmniej 3 znaki",
  }).max(20, {
    message: "Nazwa użytkownika może mieć maksymalnie 20 znaków",
  }),
  password: z.string().min(6, {
    message: "Hasło musi mieć co najmniej 6 znaków",
  }).max(100, {
    message: "Hasło może mieć maksymalnie 100 znaków",
  }),
  email: z.string().email({
    message: "Proszę podać prawidłowy adres email",
  }),
});

export async function registerUserAction(prevState, formData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Brakujące pola. Rejestracja nie powiodła się.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      zodErrors: null,
      message: "Ups! Coś poszło nie tak. Spróbuj ponownie.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      zodErrors: null,
      message: responseData.error,
    };
  }

  // Logowanie nowo zarejestrowanego użytkownika
  const loginData = await loginUserService({
    username: validatedFields.data.username,
    password: validatedFields.data.password,
  });

  if (!loginData || !loginData.accessToken) {
    return {
      ...prevState,
      message: "Rejestracja zakończona sukcesem, ale logowanie nie powiodło się.",
    };
  }

  const responseCookies = cookies();
  responseCookies.set("jwt", loginData.accessToken, config);

  return { ...prevState, zodErrors: null, message: null };
}

const schemaLogin = z.object({
  username: z.string().min(3, {
    message: "Identyfikator musi mieć co najmniej 3 znaki",
  }).max(20, {
    message: "Proszę podać prawidłową nazwę użytkownika",
  }),
  password: z.string().min(6, {
    message: "Hasło musi mieć co najmniej 6 znaków",
  }).max(50, {
    message: "Hasło musi mieć od 6 do 50 znaków",
  }),
});

export async function loginUserAction(prevState, formData) {
  const validatedFields = schemaLogin.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Brakujące pola. Logowanie nie powiodło się.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData || !responseData.accessToken) {
    return {
      ...prevState,
      message: "Ups! Coś poszło nie tak. Spróbuj ponownie.",
    };
  }

  const responseCookies = cookies();
  responseCookies.set("jwt", responseData.accessToken, config);

  return { ...prevState, zodErrors: null, message: null };
}

export async function logoutAction() {
  const responseCookies = cookies();
  responseCookies.set("jwt", "", { ...config, maxAge: 0 });
}

export async function getUser() {
  const authToken = cookies().get("jwt")?.value;
  if (!authToken) return null;

  try {
    const response = await fetch('https://api.mikorosa.pl/user', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return data.user;
    } else {
      throw new Error(data.message || "Failed to fetch user data");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getUserFromServer() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('jwt')?.value;
  if (!authToken) return null;

  try {
    const response = await fetch('https://api.mikorosa.pl/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return data.user;
    } else {
      throw new Error(data.message || 'Failed to fetch user data');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
