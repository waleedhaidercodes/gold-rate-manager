import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Investments = () => {
  const { investments, addInvestment, uploadInvestments, deleteInvestment } = useGlobalContext();
  
  const [buyRate, setBuyRate] = useState('');
  const [weight, setWeight] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!buyRate || !weight) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Convert weight to integer (milligrams) if needed, or store as grams.
      // Plan said "Grams stored as milligrams". So we multiply by 1000.
      const weightInMg = parseFloat(weight) * 1000;

      await addInvestment({
        buyRatePerGram: parseInt(buyRate),
        weightInGrams: weightInMg, // Sending milligrams to backend
        purchaseDate,
      });
      setBuyRate('');
      setWeight('');
    } catch (err) {
      setError(err);
    }
  };

  const handleDownloadTemplate = () => {
    // Direct link to backend download endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/investments/template`;
  };

  const handleExport = () => {
    // Direct link to backend export endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/investments/export`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      try {
        await deleteInvestment(id);
      } catch (err) {
        alert('Failed to delete: ' + err);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploadError('');
    try {
      await uploadInvestments(file);
      setFile(null);
      alert('Investments uploaded successfully!');
    } catch (err) {
      setUploadError(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Investment Portfolio</h1>
        
        {/* Batch Upload Form */}
        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
           <button 
            type="button" 
            onClick={handleDownloadTemplate}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
          >
            Download Template
          </button>
          <span className="text-gray-300">|</span>
           <button 
            type="button" 
            onClick={handleExport}
            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 border border-green-200"
          >
            Export Excel
          </button>
          <span className="text-gray-300">|</span>
          <form onSubmit={handleUpload} className="flex gap-2 items-center">
            <input  
            type="file" 
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            type="submit" 
            disabled={!file}
            className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Upload Excel
          </button>
          </form>
        </div>
      </div>

      {uploadError && <div className="bg-red-100 text-red-700 p-3 rounded">{uploadError}</div>}

      {/* Add Investment Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Record New Investment</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 mb-2">Purchase Date</label>
            <input 
              type="date" 
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 mb-2">Buy Rate per Tola (PKR Rs)</label>
            <input 
              type="number" 
              value={buyRate}
              onChange={(e) => setBuyRate(e.target.value)}
              placeholder="e.g. 7200"
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 mb-2">Weight (Grams)</label>
            <input 
              type="number" 
              step="0.001"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 10.5"
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Investment
          </button>
        </form>
      </div>

      {/* Investment List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Portfolio Holdings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Weight (g)</th>
                <th className="p-3 font-semibold">Buy Rate (Per Tola)</th>
                <th className="p-3 font-semibold">Total Cost</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.length === 0 ? (
                <tr>
                   <td colSpan="4" className="p-4 text-center text-gray-500">No investments recorded yet.</td>
                </tr>
              ) : (
                investments.map((inv) => {
                  const weightInGrams = inv.weightInGrams / 1000;
                  // Formula: (Rate / 11.664) * Weight
                  const totalCost = (inv.buyRatePerGram / 11.664) * weightInGrams;
                  
                  return (
                    <tr key={inv._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                      <td className="p-3 font-mono">{weightInGrams.toFixed(3)}g</td>
                      <td className="p-3 font-mono">Rs {inv.buyRatePerGram.toLocaleString()}</td>
                      <td className="p-3 font-mono font-semibold">Rs {Math.round(totalCost).toLocaleString()}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => handleDelete(inv._id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Investments;
