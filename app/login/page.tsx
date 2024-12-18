"use client";
import { login } from "@/actions/userController";
import { useActionState } from "react";

export default function page() {
  const [formState, formAction] = useActionState(login, null);

  return (
    <>
      <h2 className=" text-center text-2xl text-gray-600 mb-5">Login</h2>
      <form className="max-w-xs mx-auto" action={formAction}>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            autoComplete="off"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
          />
          {formState?.errors?.username && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{formState?.errors?.username}</span>
            </div>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />
          {formState?.errors?.password && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{formState?.errors?.password}</span>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Create Accounts
        </button>
      </form>
    </>
  );
}
