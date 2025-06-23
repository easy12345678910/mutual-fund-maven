
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Search, BookmarkIcon, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">FundTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name || 'User'}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your mutual fund investments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/search')}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Search className="h-6 w-6 text-blue-600" />
              <CardTitle className="ml-2">Search Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Discover new mutual funds to invest in</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/saved')}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookmarkIcon className="h-6 w-6 text-blue-600" />
              <CardTitle className="ml-2">Saved Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View your bookmarked mutual funds</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <CardTitle className="ml-2">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track your investment performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/search')}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
          >
            Start Exploring Funds
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
