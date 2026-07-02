import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { useRegisterUser } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const registerUser = useRegisterUser();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(data: FormData) {
    registerUser.mutate({ data }, {
      onSuccess: (res) => {
        login(res.token);
        toast({ title: `Welcome to Elara, ${res.user.name}!` });
        setLocation("/account");
      },
      onError: (e: any) => toast({ title: e?.data?.error ?? "Registration failed", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-foreground mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join Elara for a curated experience</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Full Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Priya Sharma" className="border-border rounded-none" data-testid="input-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
                  <FormControl><Input {...field} type="password" placeholder="Minimum 6 characters" className="border-border rounded-none" data-testid="input-password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <button
                type="submit"
                disabled={registerUser.isPending}
                className="w-full bg-foreground text-white text-sm py-3.5 tracking-widest uppercase hover:bg-primary transition-colors font-medium disabled:opacity-50"
                data-testid="button-register-submit"
              >
                {registerUser.isPending ? "Creating..." : "Create Account"}
              </button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
