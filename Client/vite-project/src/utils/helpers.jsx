// src/utils/helpers.js

import {
  FaPlane,
  FaShoppingBag,
  FaLightbulb,
  FaWallet,
  FaHome,
  FaBus,
  FaUtensils,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";



  export function getCategoryIcon(category) {
    const normalized = category?.toLowerCase();
  
    const categoryIcons = {
      shopping: <FaShoppingBag style={{ color: '#a78bfa', fontSize: 22 }} />,
      travel: <FaPlane style={{ color: '#38bdf8', fontSize: 22 }} />,
      'electricity bill': <FaLightbulb style={{ color: '#fde047', fontSize: 22 }} />,
      'loan repayment': <FaHome style={{ color: '#fbbf24', fontSize: 22 }} />,
      transport: <FaBus style={{ color: '#f472b6', fontSize: 22 }} />,
      accomodataion:<FaHome style={{ color: '#fbbf24', fontSize: 22 }} />,
      salary:<FaWallet style={{ color: '#8884d8', fontSize: 22 }} />

    };
  
    const icon = categoryIcons[normalized] || (
      <FaWallet style={{ color: '#8884d8', fontSize: 22 }} />
    );

    return icon;
  
  }
  
  
  
  export function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  