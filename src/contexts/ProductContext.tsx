import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  ecoImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  };
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
}

export interface Transaction {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  ecoCertificateHash: string;
  completedAt: string;
  ecoImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  };
}

interface ProductContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  buyProduct: (productId: string, buyerId: string) => Transaction | null;
  getProductById: (id: string) => Product | undefined;
  getUserProducts: (userId: string) => Product[];
  getUserTransactions: (userId: string) => Transaction[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Classic brown leather jacket in excellent condition. Perfect for sustainable fashion lovers.',
    category: 'clothing',
    condition: 'excellent',
    price: 89,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    sellerId: 'seller1',
    sellerName: 'Sarah Green',
    ecoImpact: {
      co2Saved: 15.5,
      waterSaved: 2500,
      energySaved: 45
    },
    createdAt: '2024-01-15T10:30:00Z',
    status: 'available'
  },
  {
    id: '2',
    title: 'MacBook Pro 2020',
    description: 'Well-maintained MacBook Pro with minimal wear. Great for students and professionals.',
    category: 'electronics',
    condition: 'good',
    price: 899,
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
    sellerId: 'seller2',
    sellerName: 'Mike Tech',
    ecoImpact: {
      co2Saved: 180.2,
      waterSaved: 25000,
      energySaved: 890
    },
    createdAt: '2024-01-14T14:20:00Z',
    status: 'available'
  },
  {
    id: '3',
    title: 'Antique Wooden Chair',
    description: 'Beautiful handcrafted wooden chair with intricate details. A piece of sustainable furniture.',
    category: 'furniture',
    condition: 'good',
    price: 145,
    image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg',
    sellerId: 'seller3',
    sellerName: 'Emma Vintage',
    ecoImpact: {
      co2Saved: 35.8,
      waterSaved: 1200,
      energySaved: 120
    },
    createdAt: '2024-01-13T09:15:00Z',
    status: 'available'
  }
];

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load products from localStorage or use sample data
    const storedProducts = localStorage.getItem('ecofinds-products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(sampleProducts);
      localStorage.setItem('ecofinds-products', JSON.stringify(sampleProducts));
    }

    // Load transactions from localStorage
    const storedTransactions = localStorage.getItem('ecofinds-transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds-products', JSON.stringify(updatedProducts));
  };

  const generateEcoCertificateHash = (transaction: Omit<Transaction, 'ecoCertificateHash'>) => {
    const data = `${transaction.productId}-${transaction.buyerId}-${transaction.sellerId}-${transaction.completedAt}`;
    // Simple hash simulation (in real app, use proper crypto library)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const buyProduct = (productId: string, buyerId: string): Transaction | null => {
    const product = products.find(p => p.id === productId);
    if (!product || product.status !== 'available') {
      return null;
    }

    // Update product status
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'sold' as const } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds-products', JSON.stringify(updatedProducts));

    // Create transaction
    const transaction: Omit<Transaction, 'ecoCertificateHash'> = {
      id: Date.now().toString(),
      productId,
      buyerId,
      sellerId: product.sellerId,
      completedAt: new Date().toISOString(),
      ecoImpact: product.ecoImpact
    };

    const completeTransaction: Transaction = {
      ...transaction,
      ecoCertificateHash: generateEcoCertificateHash(transaction)
    };

    const updatedTransactions = [...transactions, completeTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('ecofinds-transactions', JSON.stringify(updatedTransactions));

    return completeTransaction;
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getUserProducts = (userId: string): Product[] => {
    return products.filter(p => p.sellerId === userId);
  };

  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions.filter(t => t.buyerId === userId || t.sellerId === userId);
  };

  return (
    <ProductContext.Provider value={{
      products,
      transactions,
      addProduct,
      buyProduct,
      getProductById,
      getUserProducts,
      getUserTransactions
    }}>
      {children}
    </ProductContext.Provider>
  );
};