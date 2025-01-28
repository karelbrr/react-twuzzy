import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/my-components/my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/my-components/my-hooks/formatDate";
import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface News {
  id: string;
  created_at: string;
  title: string;
  body: string;
}

export const NewsPage = () => {
  const skeletonCount = 8;
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const fetchNews = async (id: string | undefined): Promise<News[]> => {
    const start = (Number(id) - 1) * 5;
    const end = start + 4;

    const { data, error, count } = await supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end); // Specifikace rozsahu pro stránkování

    if (error) throw new Error(error.message);

    if (data.length === 0) {
     navigate(`/news/${Number(id)-1}`)
    }

    if (count === null || start >= count) {
      return []; // Vrátí prázdné pole, pokud je start mimo rozsah položek
    }

    return data;
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<News[], Error>({
    queryKey: ["News", id],
    queryFn: () => fetchNews(id),
    enabled: !!id,
  });

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
      <Pagination className="mb-10">
        <PaginationContent>
          <PaginationItem>
            <Button asChild variant={"ghost"}>
              <Link
                className={`text-sm font-medium flex ${
                  Number(id) <= 1 ? "pointer-events-none opacity-50" : ""
                }`}
                to={Number(id) > 1 ? `/news/${Number(id) - 1}` : ""}
              >
                <ChevronLeft className="h-full size-4 mt-0.5 " />
                Previous
              </Link>
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button asChild variant={"ghost"}>
              <Link
                className="text-sm font-medium flex "
                to={`/news/${id ? id : ""}`}
              >
                {id}
              </Link>
            </Button>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <Button asChild variant={"ghost"}>
              <Link
                className={`text-sm font-medium flex ${
                  data &&
                  data.length < 5 
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
                to={`/news/${id ? Number(id) + 1 : ""}`}
              >
                Next
                <ChevronRight className="h-full size-4 mt-0.5 " />
              </Link>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};
