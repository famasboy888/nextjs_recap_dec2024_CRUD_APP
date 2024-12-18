import { deleteHaiku } from "@/actions/haikuController";
import { getCollection } from "@/lib/mongodb/db";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import Link from "next/link";

async function getHaikus(id: string) {
  const collection = await getCollection("haikus");
  const haikus = await collection
    .find({ author: ObjectId.createFromHexString(id) })
    .sort({ createdAt: -1 })
    .toArray();

  return haikus;
}

export default async function Dashboard(props: JwtPayload) {
  const haikus = await getHaikus(props.user.userId);

  return (
    <div>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Dashboard</h2>
      {haikus.map((haiku, index) => {
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">{haiku.line1}</h3>
            <p className="text-gray-600">{haiku.line2}</p>
            <p className="text-gray-600">{haiku.line3}</p>
            <div className="flex flex-row gap-4">
              <Link
                href={`/edit-haiku/${haiku._id.toString()}`}
                className="text-blue-500 hover:text-blue-700 mt-4"
              >
                Edit
              </Link>
              <form action={deleteHaiku}>
                <input
                  type="hidden"
                  name="id"
                  defaultValue={haiku?._id?.toString()}
                />
                <button className="text-red-500 hover:text-red-700 mt-4">
                  Delete
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
