import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { SlidersHorizontal, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useListProducts, useListCategories, getListProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COLORS = ["Red", "Maroon", "Gold", "Pink", "Blue", "Green", "Purple", "Black", "White", "Orange"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function Category() {
  const params = useParams<{ categorySlug: string }>();
  const categorySlug = params.categorySlug;
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const { data: categories } = useListCategories();
  const category = categories?.find((c) => c.slug === categorySlug);

  const queryParams = {
    category: categorySlug,
    sort,
    page,
    limit: 12,
    ...(minPrice && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
  };

  const { data, isLoading } = useListProducts(queryParams as any);

  useEffect(() => { setPage(1); }, [categorySlug, sort, minPrice, maxPrice]);

  function toggleSize(s: string) {
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }
  function toggleColor(c: string) {
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }
  function clearFilters() {
    setMinPrice(""); setMaxPrice(""); setSelectedSizes([]); setSelectedColors([]); setSort("newest");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="border-b border-border bg-secondary/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ letterSpacing: "0.2em" }}>Collection</p>
          <h1 className="font-serif text-4xl text-foreground capitalize">{category?.name ?? categorySlug}</h1>
          {category && <p className="text-sm text-muted-foreground mt-2">{category.productCount} pieces</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm text-foreground border border-border px-4 py-2 hover:bg-secondary transition-colors"
            data-testid="button-filter-toggle"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {data?.total ?? 0} results
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-border bg-background text-foreground px-3 py-2 outline-none"
              data-testid="select-sort"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {filterOpen && (
            <aside className="w-60 flex-shrink-0" data-testid="filter-sidebar">
              <div className="sticky top-24 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-wider uppercase">Filters</h3>
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear All</button>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase mb-4 text-muted-foreground">Price Range (₹)</h4>
                  <div className="flex gap-2">
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-full border border-border text-sm px-2 py-1.5 outline-none bg-background" data-testid="input-min-price" />
                    <span className="text-muted-foreground self-center">–</span>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-full border border-border text-sm px-2 py-1.5 outline-none bg-background" data-testid="input-max-price" />
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase mb-4 text-muted-foreground">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`text-xs px-3 py-1.5 border transition-colors ${selectedSizes.includes(s) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground"}`}
                        data-testid={`button-size-${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase mb-4 text-muted-foreground">Color</h4>
                  <div className="space-y-2">
                    {COLORS.map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(c)}
                          onChange={() => toggleColor(c)}
                          className="w-3.5 h-3.5 accent-primary"
                          data-testid={`checkbox-color-${c}`}
                        />
                        <span className="text-sm text-foreground">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted" />
                    <div className="mt-3 h-4 bg-muted w-3/4" />
                    <div className="mt-2 h-3 bg-muted w-1/2" />
                  </div>
                ))}
              </div>
            ) : data?.products?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found for the selected filters.</p>
                <button onClick={clearFilters} className="mt-4 text-primary hover:underline text-sm">Clear filters</button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 gap-6 ${filterOpen ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"}`}>
                  {data?.products?.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>

                {/* Pagination */}
                {(data?.total ?? 0) > 12 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: Math.ceil((data?.total ?? 0) / 12) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 text-sm border transition-colors ${page === i + 1 ? "border-foreground bg-foreground text-white" : "border-border text-muted-foreground hover:border-foreground"}`}
                        data-testid={`button-page-${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
