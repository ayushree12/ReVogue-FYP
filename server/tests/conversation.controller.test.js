const conversationController = require('../src/controllers/conversation.controller');
const Message = require('../src/models/Message');

jest.mock('../src/models/Message');

describe('conversation controller', () => {
  const mockConversations = [
    {
      _id: 'conv1',
      buyerId: { name: 'Priya Shrestha', email: 'priya@example.com' },
      productId: { title: 'Reworked Denim Jacket' },
      updatedAt: '2026-01-23T10:00:00.000Z',
      createdAt: '2026-01-22T09:00:00.000Z'
    }
  ];

  const latestMessage = {
    text: 'Can I expedite delivery for this order?',
    senderId: { name: 'Priya Shrestha', role: 'user' },
    createdAt: '2026-01-23T10:05:00.000Z'
  };

  beforeEach(() => {
    jest
      .spyOn(conversationController, 'buildSellerConversationQuery')
      .mockResolvedValue(mockConversations);

    Message.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(latestMessage)
    });
    Message.countDocuments.mockResolvedValue(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats seller threads from conversations', async () => {
    const req = { user: { id: 'seller-1' } };
    const res = { json: jest.fn() };

    await conversationController.listSellerConversations(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        threads: expect.arrayContaining([
          expect.objectContaining({
            customer: 'Priya Shrestha',
            preview: latestMessage.text,
            unreadCount: 2,
            orderRef: mockConversations[0].productId.title
          })
        ])
      })
    );
  });
});
