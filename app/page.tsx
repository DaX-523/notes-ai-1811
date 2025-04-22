import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-24 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src={logo} alt="logo" width={100} height={100} />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-3">
              <Link href="/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary hover:bg-secondary"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Capture your <span className="text-primary">thoughts</span>,
                  organize your life
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A simple and elegant notes app to keep track of your ideas,
                  tasks, and memories.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-secondary"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Features
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Everything you need to manage your notes efficiently.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
                <div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-6 card-gradient">
                  <h3 className="text-xl font-bold text-primary">
                    Create & Edit
                  </h3>
                  <p className="text-muted-foreground">
                    Create new notes and edit existing ones with a clean,
                    intuitive interface.
                  </p>
                </div>
                <div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-6 card-gradient">
                  <h3 className="text-xl font-bold text-primary">Organize</h3>
                  <p className="text-muted-foreground">
                    Keep your notes organized and easily accessible.
                  </p>
                </div>
                <div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-6 card-gradient">
                  <h3 className="text-xl font-bold text-primary">Summarize</h3>
                  <p className="text-muted-foreground">
                    Get AI-powered summaries of your notes with a single click.
                  </p>
                </div>
                <div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-6 card-gradient">
                  <h3 className="text-xl font-bold text-primary">Secure</h3>
                  <p className="text-muted-foreground">
                    Your notes are protected and only accessible to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Notes Hive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
