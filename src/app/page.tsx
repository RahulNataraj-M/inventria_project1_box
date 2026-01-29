
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { products as staticProducts, categories as staticCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Search, X, History } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { useInView } from 'react-intersection-observer';
import ProductListItem from '@/components/product/product-list-item';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const firestore = useFirestore();

  const productsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const categoriesRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: firestoreProducts, isLoading: productsLoading } = useCollection<Product>(productsRef);
  const { data: firestoreCategories, isLoading: categoriesLoading } = useCollection<Category>(categoriesRef);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('searchHistory');
        if (storedHistory) {
            setSearchHistory(JSON.parse(storedHistory));
        }
    } catch (error) {
        console.error("Could not parse search history from localStorage", error);
        localStorage.removeItem('searchHistory');
    }
  }, []);

  const products = useMemo(() => {
    const productMap = new Map<string, Product>();

    // Add static products first
    staticProducts.forEach(p => {
        productMap.set(p.id, p);
    });

    // Overwrite with or add Firestore products
    if (firestoreProducts) {
      firestoreProducts.forEach(p => productMap.set(p.id, p));
    }

    return Array.from(productMap.values());
  }, [firestoreProducts]);
  
  const categories = useMemo(() => {
    if (firestoreCategories) {
      const firestoreCategoryIds = new Set(firestoreCategories.map(c => c.id));
      const staticCategoriesFiltered = staticCategories.filter(c => !firestoreCategoryIds.has(c.id));
      return [...staticCategoriesFiltered, ...firestoreCategories];
    }
    return staticCategories;
  }, [firestoreCategories]);


  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (activeSearch) {
      const lowercasedQuery = activeSearch.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery) ||
        product.details?.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return result;
  }, [products, selectedCategory, activeSearch]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
     // Clear search when a category is selected/deselected
    setActiveSearch('');
    setSearchQuery('');
    setSuggestions([]);
  };
  
  const handleSearch = () => {
    const term = searchQuery.trim();
    if (!term) return;

    setActiveSearch(term);
    setSelectedCategory(null);
    setSuggestions([]);
    setIsHistoryVisible(false);

    if (term) {
        const newHistory = [term, ...searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };
  
  const handleClearSearch = () => {
    setActiveSearch('');
    setSearchQuery('');
    setSuggestions([]);
    setIsHistoryVisible(false);
  };
  
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsHistoryVisible(false);

    if (query.length > 1) {
        const lowercasedQuery = query.toLowerCase();
        const filteredSuggestions = products.filter(product =>
            product.name.toLowerCase().includes(lowercasedQuery)
        ).slice(0, 5); // Limit to 5 suggestions
        setSuggestions(filteredSuggestions);
    } else {
        setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    const term = product.name.trim();
    setSearchQuery(term);
    setActiveSearch(term);
    setSuggestions([]);
    setIsHistoryVisible(false);

    if (term) {
        const newHistory = [term, ...searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleInputFocus = () => {
    if (searchQuery === '') {
        setSuggestions([]);
        setIsHistoryVisible(true);
    }
  };

  const handleHistoryClick = (item: string) => {
    setSearchQuery(item);
    setActiveSearch(item);
    setSuggestions([]);
    setIsHistoryVisible(false);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchHistory([]);
      localStorage.removeItem('searchHistory');
      setIsHistoryVisible(false);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };


  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: searchRef, inView: searchInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: categoriesSectionRef, inView: categoriesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const isFilterActive = selectedCategory || activeSearch;

  return (
    <div className="container mx-auto px-4 py-8" onClick={() => { setSuggestions([]); setIsHistoryVisible(false); }}>
      <header
        ref={heroRef}
        className={`mb-8 text-center transition-all duration-700 ease-out ${
          heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Turn By-Products into Opportunities
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          One man's trash ,that's another man's comeup
        </p>
      </header>

      <div
        ref={searchRef}
        className={`relative z-30 mb-8 flex flex-col md:flex-row gap-4 justify-center items-center transition-all duration-700 ease-out delay-200 ${
          searchInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="relative w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for by-products, materials, or potential uses..." 
            className="pl-10 h-12 text-base" 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={handleInputFocus}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border bg-card shadow-lg">
                <ul className="py-1">
                    {suggestions.map(suggestion => (
                        <li 
                            key={suggestion.id} 
                            className="px-4 py-2 hover:bg-accent cursor-pointer"
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            </div>
          )}
          {isHistoryVisible && searchHistory.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border bg-card shadow-lg">
                <div className="p-2 flex justify-between items-center">
                    <span className="font-semibold text-sm px-2">Recent Searches</span>
                    <Button variant="link" size="sm" onClick={handleClearHistory}>Clear</Button>
                </div>
                <ul className="py-1">
                    {searchHistory.map((item, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-accent cursor-pointer flex justify-between items-center group"
                            onClick={() => handleHistoryClick(item)}
                        >
                            <div className="flex items-center gap-2">
                               <History className="h-4 w-4 text-muted-foreground" />
                               <span>{item}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(e) => handleRemoveHistoryItem(e, item)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
          )}
        </div>
        <Button size="lg" className="h-12" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div
        ref={categoriesSectionRef}
        className={`mb-12 transition-all duration-700 ease-out delay-300 ${
          categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-xl font-headline font-semibold mb-4 text-center">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categoriesLoading ? (
            <p>Loading categories...</p>
          ) : (
            categories.map((category) => (
              <Button
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                key={category.id}
                className="gap-2 transition-transform transform hover:scale-105"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
                {selectedCategory === category.name && <X className="h-4 w-4" />}
              </Button>
            ))
          )}
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-3xl font-bold">
            {activeSearch 
                ? `Search results for "${activeSearch}"`
                : selectedCategory 
                ? selectedCategory 
                : 'Featured By-Products'
            }
          </h2>
          {isFilterActive && (
            <Button variant="ghost" onClick={handleClearSearch}>
              Clear Filter
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                  <div className="w-full aspect-video rounded-lg bg-muted animate-pulse"></div>
                  <div className="h-5 w-1/3 rounded-md bg-muted animate-pulse"></div>
                  <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse"></div>
                  <div className="h-8 w-1/2 rounded-md bg-muted animate-pulse"></div>
              </div>
            ))
          ) : (
            filteredProducts.map((product, index) => (
              <ProductListItem key={product.id} product={product} index={index} />
            ))
          )}
        </div>
        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12 text-muted-foreground col-span-full">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p>Your search for "{activeSearch}" did not match any products.</p>
          </div>
        )}
      </section>
    </div>
  );
}
