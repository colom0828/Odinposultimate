'use client';

import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ReportChartData } from '../../types/reports.types';

interface ReportChartProps {
  chartData: ReportChartData;
}

export function ReportChart({ chartData }: ReportChartProps) {
  // Convertir datos al formato de Recharts
  const data = chartData.labels.map((label, index) => {
    const row: any = { name: label };
    chartData.datasets.forEach((dataset) => {
      row[dataset.label] = dataset.data[index];
    });
    return row;
  });

  // Renderizar según tipo de gráfica
  switch (chartData.type) {
    case 'bar':
      return <BarChartComponent data={data} datasets={chartData.datasets} />;
    
    case 'line':
      return <LineChartComponent data={data} datasets={chartData.datasets} />;
    
    case 'pie':
      return <PieChartComponent data={data} dataset={chartData.datasets[0]} labels={chartData.labels} />;
    
    default:
      return null;
  }
}

// ============================================
// GRÁFICA DE BARRAS
// ============================================
function BarChartComponent({ data, datasets }: { data: any[]; datasets: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
        {datasets.map((dataset, index) => (
          <Bar 
            key={index}
            dataKey={dataset.label} 
            fill={Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// GRÁFICA DE LÍNEAS
// ============================================
function LineChartComponent({ data, datasets }: { data: any[]; datasets: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
        {datasets.map((dataset, index) => (
          <Line 
            key={index}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor || '#3b82f6'}
            strokeWidth={2}
            dot={{ fill: dataset.borderColor || '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            fill={dataset.fill ? dataset.backgroundColor : 'transparent'}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// GRÁFICA DE PASTEL (PIE)
// ============================================
function PieChartComponent({ data, dataset, labels }: { data: any[]; dataset: any; labels: string[] }) {
  const pieData = labels.map((label, index) => ({
    name: label,
    value: dataset.data[index],
  }));

  const colors = Array.isArray(dataset.backgroundColor) 
    ? dataset.backgroundColor 
    : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.value}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
