import axios from "axios";

import { FormEvent } from "react";
import { toast } from "react-toastify";

export default function AuthForm({ ...props }) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    if (props.page === "registration") {
      try {
        const userData = {
          username: data.username,
          email: data.email,
          fullname: data.fullname,
          password: data.password,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(`Signup Success ${response.data.fullname}`);
        // window.location.href = "/login/admin";
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      }
    } else {
      console.log("It's a login page");
      try {
        //
        const userData = {
          username: data.username,
          password: data.password,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Login Successful", response);
        window.location.href = "/dashboard";
        // window.location.href = "/login/admin";
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  }
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl gap-8 lg:gap-16 px-4">
        <div className="text-center lg:text-left flex-1 max-w-md">
          <h1 className="text-4xl lg:text-5xl font-bold">
            {props.page === "registration" ? "Register now!" : "Login"}
          </h1>
          <p className="py-6 text-base lg:text-lg">
            {props.page === "registration"
              ? "Create your account and access the air dashboard!"
              : "Login to you account to access the air dashboard"}
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="fieldset">
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                placeholder="Username"
                name="username"
              />
              {props.page === "registration" && (
                <>
                  <label className="label">Fullname</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Fullname"
                    name="fullname"
                  />

                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    name="email"
                  />
                </>
              )}

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                name="password"
              />

              <button className="btn btn-neutral mt-4">
                {props.page === "registration" ? "Create account" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
