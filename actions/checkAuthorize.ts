"use server";
import { redirect } from "next/navigation";
import { getUserFromCookie } from "../lib/authenticateCookies/getUser";

export default async function checkAuthorize() {
    const user = await getUserFromCookie();

    if (!user) {
        redirect("/");
    } else {
        return user;
    }
}