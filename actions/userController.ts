"use server";

import { getCollection } from "@/lib/mongodb/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt, { Secret } from "jsonwebtoken";
import { redirect } from "next/navigation";

type ErrorType = {
    username: string;
    password: string;
};

type OurUserType = {
    username: FormDataEntryValue;
    password: FormDataEntryValue;
};

const isAlphaNumeric = (x: string) => {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(x);
};

export const logout = async function () {
    console.log("Logging out user...");
    (await cookies()).delete("haikuapp");
    redirect("/");
};

export const login = async (prevState: any, formData: FormData) => {

    const failedObj = {
        success: false,
        message: "Invalid username / password."
    };

    const errors: ErrorType = {
        username: "",
        password: ""
    };

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    if (typeof ourUser.username !== "string") {
        ourUser.username = "";
    }
    if (typeof ourUser.password !== "string") {
        ourUser.password = "";
    }

    const collection = await getCollection("users");
    const user = await collection.findOne({ username: ourUser.username });
    console.log(user);

    if (!user) {
        return failedObj;
    }

    const isMatched = await bcrypt.compare(ourUser.password, user.password);
    console.log(isMatched);
    if (!isMatched) {
        return failedObj;
    }

    // create jwt value
    const ourTokenValue = jwt.sign({
        userId: user._id.toString(),
        expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hoursinclude to check if jwt token has expired.
    }, process.env.JWT_SECRET as Secret);

    (await cookies()).set("haikuapp",
        ourTokenValue, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 // 24 hours
    });

    return redirect("/");
};

export const register = async (prevState: any, formData: FormData) => {
    const errors: ErrorType = {
        username: "",
        password: ""
    };

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    if (typeof ourUser.username !== "string") {
        ourUser.username = "";
    }
    if (typeof ourUser.password !== "string") {
        ourUser.password = "";
    }

    ourUser.username = ourUser.username.trim();
    ourUser.password = ourUser.password.trim();

    if (ourUser.username.length < 3) {
        errors.username = "Username must be at least 3 characters long";
    }
    if (ourUser.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }
    if (!isAlphaNumeric(ourUser.username)) errors.username = "Usernames can only contain letters and numbers.";
    if (ourUser.username == "") errors.username = "You must provide a username.";

    //check if username already exists or not
    const usersCollection = await getCollection("users");
    const existingUser = await usersCollection.findOne({ username: ourUser.username });
    if (existingUser) {
        errors.username = "Username already exists.";
    }

    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false
        };
    }

    //No vaidation errors

    //Hash password first before storing
    const salt = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);

    //Store new user in database
    const newUser = await usersCollection.insertOne(ourUser);
    const userId = newUser.insertedId.toString();

    //log in user by cookie
    //Idea of cookie is to check if they are logged in or not
    //if cookie is logged in then user
    //else if cookie is not logged in then guest

    //create jwt value
    const ourTokenValue = jwt.sign({
        userId,
        expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hoursinclude to check if jwt token has expired.
    }, process.env.JWT_SECRET as Secret);

    const cookieStore = await cookies();

    cookieStore.set("haikuapp",
        ourTokenValue, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 // 24 hours
    });


    return {
        success: true
    };
};