import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setSeller(res.data.user));
    api.get('/products').then((res) => setProducts((res.products || []).filter((product) => product.sellerId?._id === id)));
  }, [id]);

  if (!seller) {
    return <p className="text-muted">Loading seller...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow">
        <h1 className="text-3xl font-semibold">{seller.name}</h1>
        <p className="text-sm text-muted">{seller.sellerProfile?.bio || 'No story yet'}</p>
        <p className="text-sm text-muted">Verified: {seller.sellerProfile?.isVerified ? 'Yes' : 'Pending'}</p>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow space-y-3">
        <h2 className="text-2xl font-semibold">Items</h2>
        {products.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border border-slate-100 rounded-3xl p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-muted">Rs {product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No listings yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
