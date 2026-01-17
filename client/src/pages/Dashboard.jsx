import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, List } from 'lucide-react';

import { motion } from 'framer-motion';
import DashboardSkeleton from '../components/DashboardSkeleton';
import SEO from '../components/SEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const { totalTasks, completedTasks, pendingTasks, priorityStats } =
    stats || {};

  // Process data for charts
  const priorityData =
    priorityStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const completionData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const COLORS = ['#8b5cf6', '#334155', '#a78bfa']; // Primary, Slate, Lighter Primary

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <SEO
        title="Dashboard"
        description="Overview of your tasks and productivity statistics."
      />
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-white"
      >
        Dashboard
      </motion.h2>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          icon={List}
          label="Total Tasks"
          value={totalTasks}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedTasks}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={pendingTasks}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          icon={AlertCircle}
          label="Completion Rate"
          value={`${
            totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
          }%`}
          color="bg-primary-500/10 text-primary-500"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Priority Chart */}
        <motion.div variants={itemVariants} className="card h-[400px]">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">
            Tasks by Priority
          </h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f1f5f9',
                  }}
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                />
                <Legend verticalAlign="bottom" height={36} />
                <Bar
                  name="Tasks"
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No data available
            </div>
          )}
        </motion.div>

        {/* Completion Status Chart */}
        <motion.div variants={itemVariants} className="card h-[400px]">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">
            Task Status
          </h3>
          {totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f1f5f9',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No data available
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    variants={itemVariants}
    className="card flex items-center space-x-4"
  >
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
