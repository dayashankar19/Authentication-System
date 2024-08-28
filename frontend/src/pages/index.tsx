import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register"); // Redirects to the register page
  }, [router]);

  return null; // Optionally, you can display a loading indicator
}
