import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [goldRates, setGoldRates] = useState([]);
  const [currentRate, setCurrentRate] = useState(null);
  const [investments, setInvestments] = useState([]);

  // Silver State
  const [silverRates, setSilverRates] = useState([]);
  const [currentSilverRate, setCurrentSilverRate] = useState(null);
  const [silverInvestments, setSilverInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    try {
      const { data: history } = await client.get('/gold-rates/history?days=30');
      const { data: current } = await client.get('/gold-rates/current').catch(() => ({ data: null }));

      setGoldRates(history);
      setCurrentRate(current);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError(err.message);
    }
  };

  const fetchInvestments = async () => {
    try {
      const { data } = await client.get('/investments');
      setInvestments(data);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError(err.message);
    }
  };

  const fetchSilverRates = async () => {
    try {
      const { data: history } = await client.get('/silver-rates/history?days=30');
      const { data: current } = await client.get('/silver-rates/current').catch(() => ({ data: null }));

      setSilverRates(history);
      setCurrentSilverRate(current);
    } catch (err) {
      console.error('Error fetching silver rates:', err);
      // Optional: setError(err.message) if you want to block UI
    }
  };

  const fetchSilverInvestments = async () => {
    try {
      const { data } = await client.get('/silver-investments');
      setSilverInvestments(data);
    } catch (err) {
      console.error('Error fetching silver investments:', err);
    }
  };

  const addRate = async (rateData) => {
    try {
      await client.post('/gold-rates', rateData);
      await fetchRates(); // Refresh
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const addInvestment = async (invData) => {
    try {
      await client.post('/investments', invData);
      await fetchInvestments(); // Refresh
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const uploadInvestments = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await client.post('/investments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchInvestments(); // Refresh
      return data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const deleteInvestment = async (id) => {
    try {
      await client.delete(`/investments/${id}`);
      await fetchInvestments(); // Refresh
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const addSilverRate = async (rateData) => {
    try {
      await client.post('/silver-rates', rateData);
      await fetchSilverRates();
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const deleteSilverRate = async (id) => {
    try {
      await client.delete(`/silver-rates/${id}`);
      await fetchSilverRates();
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const addSilverInvestment = async (invData) => {
    try {
      await client.post('/silver-investments', invData);
      await fetchSilverInvestments();
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const deleteSilverInvestment = async (id) => {
    try {
      await client.delete(`/silver-investments/${id}`);
      await fetchSilverInvestments();
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.allSettled([
        fetchRates(),
        fetchInvestments(),
        fetchSilverRates(),
        fetchSilverInvestments()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const deleteRate = async (id) => {
    try {
      await client.delete(`/gold-rates/${id}`);
      await fetchRates(); // Refresh
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const value = {
    goldRates,
    currentRate,
    investments,
    loading,
    error,
    addRate,
    deleteRate,
    addInvestment,
    deleteInvestment,
    uploadInvestments,
    fetchRates,
    fetchInvestments,
    // Silver Exports
    silverRates,
    currentSilverRate,
    silverInvestments,
    addSilverRate,
    deleteSilverRate,
    addSilverInvestment,
    deleteSilverInvestment,
    fetchSilverRates,
    fetchSilverInvestments,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
