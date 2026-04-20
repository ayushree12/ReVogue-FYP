import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import useAuthStore from '../store/useAuthStore';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts({ limit: 20 }).then((res) => {
      setProducts((res.products || []).filter((product) => product.sellerId?._id === user?.id));
    });
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My inventory</h1>
      {products.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted">You have no active listings yet.</p>
      )}
    </div>
  );
};

export default SellerProducts;
