import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import SilverRateChart from '../components/SilverRateChart';

const SilverDashboard = () => {
    const {
        silverRates,
        currentSilverRate,
        silverInvestments,
        addSilverRate,
        deleteSilverRate,
        addSilverInvestment,
        deleteSilverInvestment
    } = useGlobalContext();

    // --- Calculations ---
    // Constant: 1 Tola = 11.664 Grams
    const TOLA_TO_GRAMS = 11.664;

    const currentRatePerGram = currentSilverRate ? currentSilverRate.ratePerGram : 0;
    const currentRatePerTola = Math.round(currentRatePerGram * TOLA_TO_GRAMS);

    const totalWeightInMg = silverInvestments.reduce((sum, inv) => sum + inv.weightInGrams, 0);
    const totalWeightInGrams = totalWeightInMg / 1000;
    const totalWeightInTola = totalWeightInGrams / TOLA_TO_GRAMS;

    const totalInvested = silverInvestments.reduce((sum, inv) => {
        // Investment stores buyRatePerGram and weightInGrams (mg)
        // Cost = (buyRatePerGram) * weightInGrams(g)
        // inv.weightInGrams is Mg.
        return sum + (inv.buyRatePerGram * (inv.weightInGrams / 1000));
    }, 0);

    const currentValuation = currentRatePerGram * totalWeightInGrams;
    const profitLoss = currentValuation - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    // --- Forms State ---
    // Rate Form
    const [rateInput, setRateInput] = useState('');
    const [rateDate, setRateDate] = useState(new Date().toISOString().split('T')[0]);

    // Investment Form
    const [invWeight, setInvWeight] = useState(''); // In Tola
    const [invRate, setInvRate] = useState(''); // Per Tola
    const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0]);

    // Messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- Handlers ---

    const handleAddRate = async (e) => {
        e.preventDefault();
        if (!rateInput) return;
        try {
            // Convert Tola Rate to Gram Rate
            const ratePerGram = parseFloat(rateInput) / TOLA_TO_GRAMS;

            await addSilverRate({
                ratePerGram,
                type: 'CLOSING',
                date: rateDate
            });
            setRateInput('');
            setMessage('Silver Rate Added!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteRate = async (id) => {
        if (window.confirm("Delete this rate?")) {
            await deleteSilverRate(id);
        }
    };

    const handleAddInvestment = async (e) => {
        e.preventDefault();
        if (!invWeight || !invRate) return;
        try {
            // Backend expects Tola inputs if we use the right endpoint/logic
            // My controller accepts weightInTola and buyRatePerTola
            await addSilverInvestment({
                weightInTola: parseFloat(invWeight),
                buyRatePerTola: parseFloat(invRate),
                date: invDate
            });
            setInvWeight('');
            setInvRate('');
            setMessage('Silver Investment Added!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteInvestment = async (id) => {
        if (window.confirm("Delete this investment?")) {
            await deleteSilverInvestment(id);
        }
    };


    return (
        <div className="space-y-8">
            {/* Header */}
            <h1 className="text-3xl font-extrabold text-black">Silver Dashboard</h1>

            {/* Notifications */}
            {message && <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Current Rate Card */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border-l-4 border-gray-400">
                    <h2 className="text-gray-400 text-sm font-semibold uppercase">Current Silver Rate</h2>
                    <p className="text-2xl font-bold text-gray-100 mt-2">Rs {currentRatePerTola.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Per Tola</p>
                </div>

                {/* Holdings Card */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border-l-4 border-gray-400">
                    <h2 className="text-gray-400 text-sm font-semibold uppercase">Total Silver Holdings</h2>
                    <p className="text-2xl font-bold text-gray-100 mt-2">{totalWeightInTola.toFixed(3)} Tola</p>
                    <p className="text-xs text-gray-500">{totalWeightInGrams.toFixed(3)} Grams</p>
                </div>

                {/* Invested Card */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border-l-4 border-gray-400">
                    <h2 className="text-gray-400 text-sm font-semibold uppercase">Total Invested</h2>
                    <p className="text-2xl font-bold text-gray-100 mt-2">Rs {Math.round(totalInvested).toLocaleString()}</p>
                </div>

                {/* Valuation Card */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border-l-4 border-gray-400">
                    <h2 className="text-gray-400 text-sm font-semibold uppercase">Current Valuation</h2>
                    <p className="text-2xl font-bold text-gray-100 mt-2">Rs {Math.round(currentValuation).toLocaleString()}</p>
                    <p className={`text-sm font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {profitLoss >= 0 ? '+' : ''}Rs {Math.round(profitLoss).toLocaleString()} ({profitLossPercentage.toFixed(2)}%)
                    </p>
                </div>
            </div>

            {/* Chart */}
            <SilverRateChart />

            {/* Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Rate Management */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border border-gray-500/20">
                    <h2 className="text-xl font-bold text-gray-300 mb-4">Manage Silver Rates</h2>

                    {/* Add Rate Form */}
                    <form onSubmit={handleAddRate} className="mb-6 space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Date</label>
                            <input
                                type="date"
                                value={rateDate} onChange={e => setRateDate(e.target.value)}
                                className="w-full bg-dark-900 border border-gray-600 rounded p-2 text-gray-100 focus:border-gray-400 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Rate Per Tola (Rs)</label>
                            <input
                                type="number"
                                value={rateInput} onChange={e => setRateInput(e.target.value)}
                                placeholder="e.g. 2500"
                                className="w-full bg-dark-900 border border-gray-600 rounded p-2 text-gray-100 focus:border-gray-400 outline-none"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded transition">
                            Add Rate
                        </button>
                    </form>

                    {/* Rate List (Mini) */}
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Rates</h3>
                    <div className="overflow-y-auto max-h-60 space-y-2">
                        {silverRates.map(rate => (
                            <div key={rate._id} className="flex justify-between items-center bg-dark-900 p-3 rounded border border-gray-700">
                                <div>
                                    <p className="text-gray-200 text-sm">{new Date(rate.rateDate).toLocaleDateString()}</p>
                                    <p className="text-gray-400 text-xs">Rs {Math.round(rate.ratePerGram * TOLA_TO_GRAMS).toLocaleString()} / Tola</p>
                                </div>
                                <button onClick={() => handleDeleteRate(rate._id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Investment Management */}
                <div className="bg-dark-800 p-6 rounded-lg shadow-md border border-gray-500/20">
                    <h2 className="text-xl font-bold text-gray-300 mb-4">Manage Investments</h2>

                    {/* Add Investment Form */}
                    <form onSubmit={handleAddInvestment} className="mb-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Date</label>
                                <input
                                    type="date"
                                    value={invDate} onChange={e => setInvDate(e.target.value)}
                                    className="w-full bg-dark-900 border border-gray-600 rounded p-2 text-gray-100 focus:border-gray-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                {/* Spacer or Type selector if needed */}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Weight (Tola)</label>
                                <input
                                    type="number" step="0.01"
                                    value={invWeight} onChange={e => setInvWeight(e.target.value)}
                                    placeholder="1.5"
                                    className="w-full bg-dark-900 border border-gray-600 rounded p-2 text-gray-100 focus:border-gray-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Buy Rate / Tola</label>
                                <input
                                    type="number"
                                    value={invRate} onChange={e => setInvRate(e.target.value)}
                                    placeholder="2600"
                                    className="w-full bg-dark-900 border border-gray-600 rounded p-2 text-gray-100 focus:border-gray-400 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded transition">
                            Add Investment
                        </button>
                    </form>

                    {/* Investment List (Mini) */}
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">My Holdings</h3>
                    <div className="overflow-y-auto max-h-60 space-y-2">
                        {silverInvestments.map(inv => {
                            const weightInTola = (inv.weightInGrams / 1000) / TOLA_TO_GRAMS;
                            const ratePerTola = inv.buyRatePerGram * TOLA_TO_GRAMS;
                            return (
                                <div key={inv._id} className="flex justify-between items-center bg-dark-900 p-3 rounded border border-gray-700">
                                    <div>
                                        <p className="text-gray-200 text-sm">{weightInTola.toFixed(2)} Tola <span className="text-gray-500">@ Rs {Math.round(ratePerTola).toLocaleString()}</span></p>
                                        <p className="text-gray-400 text-xs">{new Date(inv.purchaseDate).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteInvestment(inv._id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SilverDashboard;
