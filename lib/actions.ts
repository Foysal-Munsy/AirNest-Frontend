"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function registerUser(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  "use server";
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log("Creating user:", userData);
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/signup",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    console.log(data);
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
}

export async function signinUser(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(userData);
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/login",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      path: "/",
    });
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error(error);
    // toast.error(error as string);
    return { success: false, message: "Login failed" };
  }
}
