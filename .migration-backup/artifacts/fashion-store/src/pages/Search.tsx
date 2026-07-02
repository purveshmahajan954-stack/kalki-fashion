import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useSearchProducts } from "@workspace/api-client-react";

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const query = params.get("q") ?? "";

  const { data: results, isLoading } = useSearchProducts(
    { q: query, limit: 20 },
    { query: { enabled: query.length > 0 } }
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ letterSpacing: "0.2em" }}>Search Results</p>
          <h1 className="font-serif text-3xl text-foreground">
            {query ? `"${query}"` : "All Products"}
          </h1>
          {!isLoading && results && (
            <p className="text-sm text-muted-foreground mt-2">{results.length} results found</p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted" />
                <div className="mt-3 h-4 bg-muted w-3/4" />
                <div className="mt-2 h-3 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && results?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground">Try searching for sarees, lehengas, kurtas, or gowns.</p>
          </div>
        )}

        {!isLoading && results && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
