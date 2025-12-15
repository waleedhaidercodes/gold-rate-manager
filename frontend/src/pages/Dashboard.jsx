import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentRate, investments, loading } = useGlobalContext();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;

  // Calculations
  // Assuming currentRate.ratePerGram is now storing Rate Per Tola
  const currentRatePerTola = currentRate ? currentRate.ratePerGram : 0;
  
  const totalWeightInMg = investments.reduce((acc, inv) => acc + inv.weightInGrams, 0);
  const totalWeightInGrams = totalWeightInMg / 1000;

  const totalInvested = investments.reduce((acc, inv) => {
    // Formula: (Rate / 11.664) * Weight
    return acc + ((inv.buyRatePerGram / 11.664) * (inv.weightInGrams / 1000));
  }, 0);

  // Current Val = (CurrentRatePerTola / 11.664) * TotalWeight
  const currentValue = (currentRatePerTola / 11.664) * totalWeightInGrams;
  const totalProfit = currentValue - totalInvested;
  const isProfit = totalProfit >= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        {!currentRate && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-sm text-sm">
            ⚠ No gold rate for today. <Link to="/rates" className="underline font-bold">Add Rate</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Current Gold Rate</h2>
          <p className="text-3xl font-bold mt-2">
            {currentRatePerTola ? `PKR Rs ${currentRatePerTola.toLocaleString()}` : 'N/A'}
          </p>
          <span className="text-xs text-gray-400">Per Tola (Closing)</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Total Gold Holdings</h2>
          <p className="text-3xl font-bold mt-2">{totalWeightInGrams.toFixed(3)} <span className="text-lg text-gray-400">g</span></p>
          <span className="text-xs text-gray-400">{(totalWeightInGrams / 11.664).toFixed(2)} Tola</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Total Invested</h2>
          <p className="text-3xl font-bold mt-2">PKR Rs {Math.round(totalInvested).toLocaleString()}</p>
        </div>

        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${isProfit ? 'border-green-500' : 'border-red-500'}`}>
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Current Valuation</h2>
          <p className="text-3xl font-bold mt-2">PKR Rs {Math.round(currentValue).toLocaleString()}</p>
          <div className={`mt-1 font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}PKR Rs {Math.round(totalProfit).toLocaleString()} 
            {totalInvested > 0 && <span> ({((totalProfit / totalInvested) * 100).toFixed(2)}%)</span>}
          </div>
        </div>
      </div>
      
      {investments.length > 0 && (
         <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-bold mb-4">Investment Summary</h3>
           <p className="text-gray-600">Your portfolio is currently valued at <b>PKR Rs {Math.round(currentValue).toLocaleString()}</b> against an investment of <b>PKR Rs {Math.round(totalInvested).toLocaleString()}</b>.</p>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
