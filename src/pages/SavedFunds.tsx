
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, Trash2, ArrowUp, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SavedFund {
  schemeCode: number;
  schemeName: string;
  nav: string;
  date: string;
}

const SavedFunds = () => {
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load saved funds from localStorage
    const funds = JSON.parse(localStorage.getItem('savedFunds') || '[]');
    setSavedFunds(funds);
    setIsLoading(false);
  }, [navigate]);

  const removeFund = (schemeCode: number) => {
    const updatedFunds = savedFunds.filter(fund => fund.schemeCode !== schemeCode);
    setSavedFunds(updatedFunds);
    localStorage.setItem('savedFunds', JSON.stringify(updatedFunds));
    
    toast({
      title: "Fund Removed",
      description: "Fund has been removed from your saved list",
    });
  };

  const handleFundClick = (fund: SavedFund) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your saved funds...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate('/search')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Funds
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/');
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">My Saved Funds</h1>
          </div>
          <p className="text-gray-600">
            Keep track of your favorite mutual funds and monitor their performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{savedFunds.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Equity Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{savedFunds.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+15.2%</div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Funds List */}
        {savedFunds.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Funds Yet</h3>
              <p className="text-gray-500 mb-6">
                Start building your watchlist by searching and saving mutual funds
              </p>
              <Button onClick={() => navigate('/search')} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search Mutual Funds
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Saved Funds ({savedFunds.length})
              </h2>
            </div>

            {savedFunds.map((fund) => (
              <Card 
                key={fund.schemeCode}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 cursor-pointer" onClick={() => handleFundClick(fund)}>
                      <CardTitle className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {fund.schemeName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Scheme Code: {fund.schemeCode}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(fund.nav)}
                        </div>
                        <div className="text-sm text-gray-500">
                          NAV as of {fund.date}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFund(fund.schemeCode);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
