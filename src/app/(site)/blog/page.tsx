import { StubPage, stubMetadata } from "@/components/site/stub-page";

export const metadata = stubMetadata("blog");

export default function Page() {
  return <StubPage slug="blog" />;
}
