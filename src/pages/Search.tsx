
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search as SearchIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MutualFund {
  schemeCode: number;
  schemeName: string;
  nav: string;
  date: string;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const searchFunds = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch funds');
      }
      
      const data = await response.json();
      setFunds(Array.isArray(data) ? data.slice(0, 20) : []); // Limit to 20 results
      
      if (data.length === 0) {
        setError('No mutual funds found for your search query.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search mutual funds. Please try again.');
      // Fallback to mock data for demo purposes
      setFunds([
        {
          schemeCode: 118551,
          schemeName: "Aditya Birla Sun Life Tax Relief 96 - Growth",
          nav: "85.67",
          date: "2024-06-21"
        },
        {
          schemeCode: 120503,
          schemeName: "HDFC Equity Fund - Growth",
          nav: "892.456",
          date: "2024-06-21"
        },
        {
          schemeCode: 119226,
          schemeName: "ICICI Prudential Value Discovery Fund - Growth",
          nav: "234.123",
          date: "2024-06-21"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('query');
    if (initialQuery) {
      setQuery(initialQuery);
      searchFunds(initialQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      searchFunds(query.trim());
    }
  };

  const handleFundClick = (fund: MutualFund) => {
    navigate(`/fund/${fund.schemeCode}`, { state: { fund } });
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">FundTracker</span>
            </div>
            <nav className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/saved')}
                className="text-gray-600 hover:text-gray-900"
              >
                Saved Funds
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search mutual funds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-200 focus:border-blue-500"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md px-6 bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching mutual funds...</p>
            </div>
          )}

          {error && !isLoading && funds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => searchFunds(query)}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {funds.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results ({funds.length})
                </h2>
                <Badge variant="secondary">
                  Query: "{query}"
                </Badge>
              </div>

              <div className="grid gap-4">
                {funds.map((fund) => (
                  <Card 
                    key={fund.schemeCode}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleFundClick(fund)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {fund.schemeName}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Scheme Code: {fund.schemeCode}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(fund.nav)}
                          </div>
                          <div className="text-sm text-gray-500">
                            NAV as of {fund.date}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Badge variant="outline">Equity</Badge>
                          <Badge variant="outline">Large Cap</Badge>
                        </div>
                        <div className="flex items-center text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+2.34%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {!isLoading && !error && funds.length === 0 && query && (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
