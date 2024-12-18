"use server";

import checkAuthorize from "@/actions/checkAuthorize";
import { getCollection } from "@/lib/mongodb/db";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

type ErrorType = {
    line1: string;
    line2: string;
    line3: string;
};

function isAlphaNumericAndSpaces(x: string) {
    const regex = /^[a-zA-Z0-9 .,]*$/;
    return regex.test(x);
}

async function sharedHaikuLogic(formData: any, user: any) {
    const errors: ErrorType = {
        line1: "",
        line2: "",
        line3: ""
    };

    const ourHaiku = {
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        line3: formData.get("line3"),
        author: ObjectId.createFromHexString(user.userId)
    };

    if (typeof ourHaiku.line1 != "string") ourHaiku.line1 = "";
    if (typeof ourHaiku.line2 != "string") ourHaiku.line2 = "";
    if (typeof ourHaiku.line3 != "string") ourHaiku.line3 = "";

    ourHaiku.line1 = ourHaiku.line1.replace(/(\r\n|\n|\r)/g, " ");
    ourHaiku.line2 = ourHaiku.line2.replace(/(\r\n|\n|\r)/g, " ");
    ourHaiku.line3 = ourHaiku.line3.replace(/(\r\n|\n|\r)/g, " ");

    ourHaiku.line1 = ourHaiku.line1.trim();
    ourHaiku.line2 = ourHaiku.line2.trim();
    ourHaiku.line3 = ourHaiku.line3.trim();

    if (ourHaiku.line1.length < 5) errors.line1 = "Line 1 must be at least 5 characters long.";
    if (ourHaiku.line2.length < 5) errors.line2 = "Line 2 must be at least 5 characters long.";
    if (ourHaiku.line3.length < 5) errors.line3 = "Line 3 must be at least 5 characters long.";

    if (ourHaiku.line1.length > 25) errors.line1 = "Line 1 must be less than 25 characters long.";
    if (ourHaiku.line2.length > 25) errors.line2 = "Line 2 must be less than 25 characters long.";
    if (ourHaiku.line3.length > 25) errors.line3 = "Line 3 must be less than 25 characters long.";

    if (!isAlphaNumericAndSpaces(ourHaiku.line1)) errors.line1 = "Line 1 must contain only letters, numbers, spaces, and commas.";
    if (!isAlphaNumericAndSpaces(ourHaiku.line2)) errors.line2 = "Line 2 must contain only letters, numbers, spaces, and commas.";
    if (!isAlphaNumericAndSpaces(ourHaiku.line3)) errors.line3 = "Line 3 must contain only letters, numbers, spaces, and commas.";

    if (ourHaiku.line1.length == 0) errors.line1 = "You must provide a line 1.";
    if (ourHaiku.line2.length == 0) errors.line2 = "You must provide a line 2.";
    if (ourHaiku.line3.length == 0) errors.line3 = "You must provide a line 3.";

    return {
        errors,
        ourHaiku
    };
}

export async function createHaiku(prevState: any, formData: FormData) {
    const user = await checkAuthorize();

    const results = await sharedHaikuLogic(formData, user);

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {
            errors: results.errors,
        };
    }

    //save to db
    const haikusCollection = await getCollection("haikus");
    const newHaiku = await haikusCollection.insertOne(results.ourHaiku);

    return redirect("/");
}

export async function editHaiku(prevState: any, formData: FormData) {
    const user: any = await checkAuthorize();

    const results = await sharedHaikuLogic(formData, user);

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {
            errors: results.errors,
        };
    }

    //save to db
    const haikusCollection = await getCollection("haikus");
    let haikuId = formData.get("haikuId")?.toString() || "";

    //make sure you are the authorized owner
    const isHaikuAuthorized = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) });

    if (isHaikuAuthorized?.author.toString() !== user?.userId) {
        return redirect("/");
    }

    //finally save to db
    if (haikuId) {
        await haikusCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(haikuId) },
            { $set: results.ourHaiku });
    }

    return redirect("/");
}

import React from 'react';

export async function deleteHaiku(formData: FormData) {
    const user: any = await checkAuthorize();

    //save to db
    const haikusCollection = await getCollection("haikus");
    let haikuId = formData.get("id")?.toString() || "";
    if (typeof haikuId != "string") haikuId = "";

    console

    //make sure you are the authorized owner
    const isHaikuAuthorized = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) });

    if (isHaikuAuthorized?.author.toString() !== user?.userId) {
        return redirect("/");
    }

    //finally save to db
    if (haikuId) {
        await haikusCollection.deleteOne(
            { _id: ObjectId.createFromHexString(haikuId) });
    }

    return redirect("/");
}

