import { registrationSchema } from "@/lib/auth.schema";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "react-toastify";

export default function AuthForm({ ...props }) {
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    // console.log(data);
    if (props.page === "registration") {
      const parsed = registrationSchema.safeParse(data);

      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        const message = firstIssue?.message ?? "Invalid input";
        toast.error(message);
        return;
      }

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

        toast.success(
          `Signup Success ${response.data.fullname}. You can login now!`
        );
        router.push("/login/admin");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error("Signup failed");
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

        router.push("/dashboard");
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
                    type="text"
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

              {/* paragraph under the button */}

              {props.page === "registration" ? (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-gray-500">Have an account?</p>
                  <Link href="/login/admin" className="link link-primary">
                    Login
                  </Link>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-gray-500">Don&apos;t have an account?</p>
                  <Link href="/registration" className="link link-primary">
                    Registration
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
