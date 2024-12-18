import HaikuForm from "@/components/HaikuForm";
import { getCollection } from "@/lib/mongodb/db";
import { ObjectId } from "mongodb";

async function getDoc(id: string) {
  const collection = await getCollection("haikus");
  const result = await collection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return JSON.parse(JSON.stringify(result));
}

export default async function page(props: { params: { id: string } }) {
  const { id } = await props.params;
  const doc = await getDoc(id);

  return (
    <div>
      <h2>Edit Post</h2>
      <HaikuForm action="edit" haiku={doc} />
    </div>
  );
}
