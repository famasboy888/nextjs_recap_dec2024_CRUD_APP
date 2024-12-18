import { cookies } from "next/headers";
import jwt, { Secret } from "jsonwebtoken";

export async function getUserFromCookie() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("haikuapp")?.value;

    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, process.env.JWT_SECRET as Secret);

            return decoded;
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    }
}
