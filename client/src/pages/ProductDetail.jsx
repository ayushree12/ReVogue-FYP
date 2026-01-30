import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import { addCartItem } from '../api/cart';
import { startConversation } from '../api/conversations';
import ProductGallery from '../components/ProductGallery';
import ReviewList from '../components/ReviewList';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct(id).then((res) => setProduct(res.product));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Please sign in before adding items to your cart', 'error');
      navigate('/login');
      return;
    }
    const currentStatus = product.status || 'available';
    if (currentStatus !== 'available') {
      showToast('This product is not available at the moment', 'error');
      return;
    }
    setAdding(true);
    try {
      await addCartItem(product._id);
      showToast('Product added to cart', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not add product to cart';
      showToast(message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!user) {
      showToast('Please login before messaging a seller', 'error');
      navigate('/login');
      return;
    }
    if (!messageDraft.trim()) {
      showToast('Please write a message before contacting the seller', 'error');
      return;
    }
    setSendingMessage(true);
    try {
      const res = await startConversation({
        productId: product._id,
        message: messageDraft.trim()
      });
      const conversationId = res?.conversation?._id || res?.conversation?.id;
      showToast('Message sent. The seller will reply in your inbox', 'success');
      setMessageDraft('');
      if (conversationId) {
        navigate(`/messages?conversationId=${conversationId}`);
      } else {
        navigate('/messages');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to reach the seller right now';
      showToast(message, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleOpenConversation = async () => {
    if (!user) {
      showToast('Please login before messaging a seller', 'error');
      navigate('/login');
      return;
    }
    try {
      const res = await startConversation({ productId: product._id });
      const conversationId = res?.conversation?._id || res?.conversation?.id;
      if (conversationId) {
        navigate(`/messages?conversationId=${conversationId}`);
      } else {
        navigate('/messages');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to open the chat right now';
      showToast(message, 'error');
    }
  };

  if (!product) {
    return <p className="text-muted">Loading product...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow space-y-4">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-3">
            <ProductGallery images={product.images} />
            <p className="text-base leading-relaxed text-muted mt-2">{product.description}</p>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-2">{product.title}</h1>
            <p className="text-2xl md:text-3xl font-bold text-accent">{product.price?.toLocaleString()}</p>
            <div className="space-y-1">
              <p className="text-xl md:text-2xl font-semibold text-slate-700 uppercase tracking-wide">{product.title}</p>
              <p className="text-base md:text-lg text-muted">Condition: {product.condition}</p>
              <p className="text-base md:text-lg text-muted">Seller: {product.sellerId?.name || 'Unknown'}</p>
              <p className="text-base md:text-lg text-muted">Location: {product.location?.city || 'Nepal'}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full rounded-3xl py-3 text-white mt-4 ${
                adding ? 'bg-accent/60 cursor-not-allowed' : 'bg-accent hover:brightness-110'
              }`}
              disabled={adding}
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            <div className="space-y-3 mt-4">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Message the seller</label>
              <textarea
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                rows={3}
                placeholder="Ask about condition, sizing, or delivery."
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleMessageSeller}
                disabled={sendingMessage}
                className={`w-full rounded-3xl py-3 text-white ${
                  sendingMessage ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {sendingMessage ? 'Sending…' : 'Message seller'}
              </button>
              <button
                type="button"
                onClick={handleOpenConversation}
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900"
              >
                Open chat
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow">
        <h3 className="text-2xl font-semibold">Reviews</h3>
        <ReviewList reviews={product.reviews || []} />
      </div>
    </section>
  );
};

export default ProductDetail;
