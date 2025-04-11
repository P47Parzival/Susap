import { Users, Settings, FileText, Target, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockAgents = [
  {
    id: 1,
    title: "Historical Interview Practice",
    description: "Practice interviews with historical figures and events",
    icon: FileText,
  },
  {
    id: 2,
    title: "Political Discussion",
    description: "Engage in political debates and discussions",
    icon: Target,
  },
];

function MockTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <Users className="h-8 w-8" />
            Susap
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-200 transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-6 h-6 rounded-full" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow-sm p-4 mr-8">
          <nav className="space-y-2">
            <Link to="/mock-test" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target className="h-5 w-5" />
              Mock Test
            </Link>
            <Link to="/results" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5" />
              Results
            </Link>
            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Choose Your Practice Mode</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {mockAgents.map((agent) => (
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <agent.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{agent.title}</h3>
                    <p className="text-gray-600 mb-4">{agent.description}</p>
                    <button className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
                      Start Mock Test
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MockTestPage;
