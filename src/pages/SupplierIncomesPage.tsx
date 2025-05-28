// src/pages/SupplierIncomesPage.tsx (Mantine, только Chart)
import React from 'react';
import { Container, Center } from '@mantine/core';
import SupplierIncomesDashboard from '../components/SupplierIncomesDashboard';
import SupplierIncomesTableAG from '../components/SupplierIncomesTableAG';
import GlobalFilterBar from '../components/GlobalFilterBar';

const SupplierIncomesPage: React.FC = () => {
  return (
    <div> 
      <GlobalFilterBar />   
      <SupplierIncomesDashboard  /> 
      <SupplierIncomesTableAG />  
    </div>    
  );
};

export default SupplierIncomesPage;