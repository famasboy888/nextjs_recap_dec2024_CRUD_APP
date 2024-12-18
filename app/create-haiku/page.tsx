import checkAuthorize from "@/actions/checkAuthorize";
import HaikuForm from "@/components/HaikuForm";

export default async function page() {
  await checkAuthorize();
  return (
    <>
      <h2 className=" text-center text-2xl text-gray-600 mb-5">Create Haiku</h2>
      <HaikuForm action="create" />
    </>
  );
}
