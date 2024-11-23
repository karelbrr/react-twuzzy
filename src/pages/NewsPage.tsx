import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/my-components/createClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface News {
  id: string;
  created_at: string;
  title: string;
  body: string;
}

export const NewsPage = () => {
  const skeletonCount = 8;
  const fetchNews = async (): Promise<News[]> => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<News[], Error>({
    queryKey: ["News"],
    queryFn: fetchNews,
  });

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Zobrazí den v týdnu (např. "Saturday")
      year: "numeric", // Zobrazí rok (např. "2024")
      month: "long", // Zobrazí měsíc v textové podobě (např. "November")
      day: "numeric", // Zobrazí den v měsíci (např. "23")
      hour: "2-digit", // Zobrazí hodinu ve formátu 2 číslic (např. "13")
      minute: "2-digit", // Zobrazí minuty ve formátu 2 číslic (např. "54")
      timeZoneName: "short", // Zobrazí zkratku časového pásma (např. "UTC")
      timeZone: "Europe/Prague", // Nastaví časové pásmo na CET
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  return (
    <section className="w-1/2 m-auto">
      <div className="flex justify-between items-baseline mt-10 mb-4 ">
        <h2 className="font-bold text-3xl ">Twüzzy News</h2>
        <Button variant={"outline"} asChild>
          <Link to={"/"}>
            <ExternalLink />
            back to Twüzzy
          </Link>
        </Button>
      </div>
      <Separator />
      <div>
        {isLoading &&
          Array.from({ length: skeletonCount }).map((_, index) => (
            <Card className="my-4" key={index}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="w-1/2 h-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-1/3 h-5" />
              </CardContent>
              <CardFooter>
                <Skeleton className="w-1/4 h-3" />
              </CardFooter>
            </Card>
          ))}
        {errorQuery && (
          <Card className="my-4 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-700">Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-red-700"> {errorQuery.message}</p>
            </CardContent>
          </Card>
        )}
        {data?.map((item) => (
          <Card key={item.id} className="my-4">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.body}</p>
            </CardContent>
            <CardFooter>
              <CardDescription>{formatDate(item.created_at)}</CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};