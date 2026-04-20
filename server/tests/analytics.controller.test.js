const { getSellerAnalytics } = require('../src/controllers/analytics.controller');

const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const Conversation = require('../src/models/Conversation');

describe('analytics controller', () => {
  it('returns aggregated metrics for a seller', async () => {
    const orders = [
      { totalAmount: 5000, payment: { paymentStatus: 'Paid' } },
      { totalAmount: 3000, payment: { paymentStatus: 'Paid' } },
      { totalAmount: 4000, payment: { paymentStatus: 'Pending' } }
    ];
    const products = [
      { title: 'Denim Jacket', status: 'available' },
      { title: 'Handloom Top', status: 'sold' }
    ];

    Order.find = jest.fn().mockResolvedValue(orders);
    Product.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(products)
    });
    Conversation.countDocuments = jest.fn().mockResolvedValue(5);

    const req = { user: { id: 'seller-1' } };
    const res = { json: jest.fn() };

    try {
      await getSellerAnalytics(req, res);
    } catch (err) {
      console.error('analytics error', err);
      throw err;
    }

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        metrics: expect.any(Array),
        trendPoints: expect.arrayContaining([
          expect.objectContaining({ label: 'Orders', value: orders.length })
        ]),
        alerts: expect.any(Array)
      })
    );
  });
});
