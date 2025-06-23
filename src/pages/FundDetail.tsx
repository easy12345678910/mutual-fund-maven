
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, ArrowLeft, Heart, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FundData {
  schemeCode: number;
  schemeName: string;
  nav: string;
  date: string;
}

interface NavHistory {
  date: string;
  nav: string;
}

const FundDetail = () => {
  const { schemeCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fund, setFund] = useState<FundData | null>(location.state?.fund || null);
  const [navHistory, setNavHistory] = useState<NavHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchFundData = async () => {
      if (!fund && schemeCode) {
        setIsLoading(true);
        try {
          const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
          const data = await response.json();
          
          if (data && data.meta) {
            setFund({
              schemeCode: parseInt(schemeCode),
              schemeName: data.meta.scheme_name,
              nav: data.data[0]?.nav || '0',
              date: data.data[0]?.date || new Date().toISOString().split('T')[0]
            });
            setNavHistory(data.data?.slice(0, 30) || []);
          }
        } catch (error) {
          console.error('Error fetching fund data:', error);
          toast({
            title: "Error",
            description: "Failed to load fund details",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFundData();
    
    // Check if fund is saved (mock check)
    const savedFunds = JSON.parse(localStorage.getItem('savedFunds') || '[]');
    setIsSaved(savedFunds.some((f: any) => f.schemeCode === parseInt(schemeCode || '0')));
  }, [schemeCode, fund, toast]);

  const handleSaveFund = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to save funds",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const savedFunds = JSON.parse(localStorage.getItem('savedFunds') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updatedFunds = savedFunds.filter((f: any) => f.schemeCode !== fund?.schemeCode);
      localStorage.setItem('savedFunds', JSON.stringify(updatedFunds));
      setIsSaved(false);
      toast({
        title: "Fund Removed",
        description: "Fund has been removed from your saved list",
      });
    } else {
      // Add to saved
      savedFunds.push(fund);
      localStorage.setItem('savedFunds', JSON.stringify(savedFunds));
      setIsSaved(true);
      toast({
        title: "Fund Saved",
        description: "Fund has been added to your saved list",
      });
    }
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
          <p className="mt-4 text-gray-600">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fund Not Found</h2>
          <Button onClick={() => navigate('/search')}>
            Back to Search
          </Button>
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
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </div>

        {/* Fund Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {fund.schemeName}
                </CardTitle>
                <CardDescription className="text-lg">
                  Scheme Code: {fund.schemeCode}
                </CardDescription>
                <div className="flex space-x-2 mt-3">
                  <Badge>Equity Fund</Badge>
                  <Badge variant="outline">Large Cap</Badge>
                  <Badge variant="outline">High Risk</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {formatCurrency(fund.nav)}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  NAV as of {fund.date}
                </div>
                <Button 
                  onClick={handleSaveFund}
                  className={`${isSaved ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isSaved ? (
                    <>
                      <Heart className="h-4 w-4 mr-2 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Fund
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Fund Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fund Type:</span>
                    <span className="font-medium">Equity Fund</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">Large Cap</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-medium text-orange-600">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expense Ratio:</span>
                    <span className="font-medium">1.25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exit Load:</span>
                    <span className="font-medium">1% if redeemed within 365 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1 Month:</span>
                    <span className="font-medium text-green-600">+3.24%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">3 Months:</span>
                    <span className="font-medium text-green-600">+8.45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">6 Months:</span>
                    <span className="font-medium text-green-600">+15.23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">1 Year:</span>
                    <span className="font-medium text-green-600">+22.67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">3 Years:</span>
                    <span className="font-medium text-green-600">+18.45% (CAGR)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>NAV History</CardTitle>
                <CardDescription>
                  Recent Net Asset Value history for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {navHistory.length > 0 ? (
                    navHistory.map((nav, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">{nav.date}</span>
                        <span className="font-medium">{formatCurrency(nav.nav)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      NAV history not available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
                <CardDescription>
                  Portfolio composition and top stock holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Holdings data will be available soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Fund Documents</CardTitle>
                <CardDescription>
                  Important documents and disclosures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Documents will be available soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FundDetail;
