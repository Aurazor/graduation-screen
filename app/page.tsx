import CongratsPage from "@/components/CongratsPage";

interface PageProps {
  searchParams: Promise<{ name?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name ? decodeURIComponent(params.name) : "Graduate";
  return <CongratsPage name={name} />;
}