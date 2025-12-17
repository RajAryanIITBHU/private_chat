import Lobby from "@/components/Lobby";


export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string; destroyed?: string };
}) {
  const resolvedSearchParams = await searchParams
  return <Lobby searchParams={resolvedSearchParams} />;
}