// src/pages/SupplierIncomesPage.tsx (Mantine, только Chart)
import React from 'react';
import { Container, Center } from '@mantine/core';
import SupplierIncomesTableAG from '../components/SupplierIncomesTableAG';
import GlobalFilterBar from '../components/GlobalFilterBar';

const SupplierIncomesPage: React.FC = () => {
  return (
    <div> 
      <GlobalFilterBar />
      <SupplierIncomesTableAG /> 
    </div>    
  );
};

export default SupplierIncomesPage;