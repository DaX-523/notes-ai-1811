import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function NoteSkeleton() {
  return (
    <Card className="flex flex-col card-gradient border-border/50 transition-all overflow-hidden">
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 rounded-md bg-muted/40 animate-shimmer"></div>
        <div className="h-4 w-1/3 mt-1 rounded-md bg-muted/40 animate-shimmer"></div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-muted/40 animate-shimmer"></div>
          <div className="h-4 w-11/12 rounded-md bg-muted/40 animate-shimmer"></div>
          <div className="h-4 w-4/5 rounded-md bg-muted/40 animate-shimmer"></div>
          <div className="h-4 w-3/4 rounded-md bg-muted/40 animate-shimmer"></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="h-8 w-24 rounded-md bg-muted/40 animate-shimmer"></div>
        <div className="h-8 w-20 rounded-md bg-muted/40 animate-shimmer"></div>
        <div className="h-8 w-20 rounded-md bg-muted/40 animate-shimmer"></div>
      </CardFooter>
    </Card>
  );
}
