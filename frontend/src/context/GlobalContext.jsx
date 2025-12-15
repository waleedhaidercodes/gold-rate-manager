import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [goldRates, setGoldRates] = useState([]);
  const [currentRate, setCurrentRate] = useState(null);
  const [investments, setInvestments] = useState([]);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.allSettled([fetchRates(), fetchInvestments()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const value = {
    goldRates,
    currentRate,
    investments,
    loading,
    error,
    addRate,
    addInvestment,
    deleteInvestment,
    uploadInvestments,
    fetchRates,
    fetchInvestments,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
