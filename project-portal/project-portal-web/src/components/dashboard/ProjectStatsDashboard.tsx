'use client';

import { useEffect } from 'react';
import { TrendingUp, Trees, Coins, Globe, Droplets, Leaf } from 'lucide-react';
import { useFarmer } from '@/contexts/FarmerContext';
import { useReportsStore } from '@/store/store';
import { Loader2 } from 'lucide-react';

const ProjectStatsDashboard = () => {
  const { stats } = useFarmer();
  const {
    dashboardSummary,
    dashboardSummaryLoading,
    dashboardSummaryError,
    fetchDashboardSummary,
  } = useReportsStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  const metrics = dashboardSummary?.performance_metrics ?? {};
  const trendLabel = metrics.total_credits?.trend === 'up'
    ? `Overall +${Math.abs(metrics.total_credits?.change_percent ?? 0).toFixed(0)}% this quarter`
    : dashboardSummary
      ? `Overall ${(metrics.total_credits?.change_percent ?? 0) >= 0 ? '+' : ''}${(metrics.total_credits?.change_percent ?? 0).toFixed(0)}% this quarter`
      : 'Overall +18% this quarter';

  const statRows = [
    {
      icon: Trees,
      label: 'Total Trees',
      value: dashboardSummary
        ? (metrics.trees?.value ?? stats.totalProjects * 2000)?.toLocaleString()
        : '12,458',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Coins,
      label: 'Credits Minted',
      value: dashboardSummary
        ? (dashboardSummary.total_credits ?? stats.totalCredits)?.toLocaleString()
        : stats.totalCredits?.toLocaleString() ?? '8,450',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: Globe,
      label: 'Area Covered',
      value: dashboardSummary
        ? `${(metrics.area_ha?.value ?? stats.totalProjects * 8.2).toFixed(1)} ha`
        : '42.5 ha',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Droplets,
      label: 'Water Saved',
      value: dashboardSummary
        ? `${((metrics.water_saved_l?.value ?? 2.4) * 1e6).toFixed(1)}M L`
        : '2.4M L',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      icon: Leaf,
      label: 'Carbon Sequestered',
      value: dashboardSummary
        ? `${(metrics.carbon_t?.value ?? dashboardSummary.total_credits ?? 1240).toFixed(0)} t`
        : '1,240 t',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'Revenue Generated',
      value: dashboardSummary
        ? `$${(dashboardSummary.total_revenue ?? stats.totalRevenue ?? 24850).toLocaleString()}`
        : `$${(stats.totalRevenue ?? 24850).toLocaleString()}`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const creditPct = dashboardSummary
    ? (metrics.credit_issuance_pct?.value ?? 78)
    : 78;
  const verificationPct = dashboardSummary
    ? (metrics.verification_pct?.value ?? 92)
    : 92;

  if (dashboardSummaryLoading && !dashboardSummary) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center justify-center min-h-[280px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Project Performance</h2>
        {dashboardSummaryError && (
          <span className="text-sm text-amber-600">Using cached data</span>
        )}
        <div className="flex items-center text-emerald-600">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span className="font-medium">{trendLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statRows.map((stat) => (
          <div key={stat.label} className="text-center p-4 rounded-xl hover:scale-105 transition-transform duration-200">
            <div className={`inline-flex p-3 rounded-full ${stat.bg} ${stat.color} mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Credit Issuance Progress</span>
            <span className="font-bold text-gray-900">{creditPct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: `${creditPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Verification Status</span>
            <span className="font-bold text-gray-900">{verificationPct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: `${verificationPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatsDashboard;
