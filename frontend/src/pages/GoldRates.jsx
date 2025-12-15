import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const GoldRates = () => {
  const { goldRates, addRate } = useGlobalContext();
  const [rate, setRate] = useState('');
  const [type, setType] = useState('CLOSING');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!rate || rate <= 0) {
      setError('Please enter a valid rate.');
      return;
    }

    try {
      await addRate({
        ratePerGram: parseInt(rate),
        type,
        date
      });
      setRate(''); // Reset form
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gold Rates Management</h1>

      {/* Add Rate Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Rate</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
             <label className="block text-gray-700 mb-2">Rate Type</label>
             <select 
               value={type} 
               onChange={(e) => setType(e.target.value)}
               className="w-full border rounded p-2"
             >
               <option value="CLOSING">Closing Rate (Official)</option>
               <option value="INTRADAY">Intraday / Other</option>
             </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 mb-2">Rate per Tola (PKR Rs)</label>
            <input 
              type="number" 
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 7500"
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Add Rate
          </button>
        </form>
      </div>

      {/* Rates History Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Rate History (Last 30 Days)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Rate (Per Tola)</th>
                <th className="p-3 font-semibold">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {goldRates.length === 0 ? (
                <tr>
                   <td colSpan="4" className="p-4 text-center text-gray-500">No rates recorded yet.</td>
                </tr>
              ) : (
                goldRates.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(item.rateDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'CLOSING' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono">PKR Rs {item.ratePerGram.toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-500">{new Date(item.recordedAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoldRates;
