import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { useLoginUser } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const loginUser = useLoginUser();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: FormData) {
    loginUser.mutate({ data }, {
      onSuccess: (res) => {
        login(res.token);
        toast({ title: `Welcome back, ${res.user.name}!` });
        setLocation("/account");
      },
      onError: () => toast({ title: "Invalid email or password", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-foreground mb-2">Sign In</h1>
            <p className="text-sm text-muted-foreground">Welcome back to Elara</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="priya@example.com" className="border-border rounded-none" data-testid="input-email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Password</FormLabel>
                  <FormControl><Input {...field} type="password" placeholder="••••••••" className="border-border rounded-none" data-testid="input-password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <button
                type="submit"
                disabled={loginUser.isPending}
                className="w-full bg-foreground text-white text-sm py-3.5 tracking-widest uppercase hover:bg-primary transition-colors font-medium disabled:opacity-50"
                data-testid="button-login-submit"
              >
                {loginUser.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
            </p>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">Demo admin: admin@elara.com / Elara@2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
