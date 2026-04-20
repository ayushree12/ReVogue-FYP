const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

const buildThreadPayload = async ({ thread, currentUserId, counterpartName, counterpartRole }) => {
  const latestMessage = await Message.findOne({ conversationId: thread._id })
    .sort('-createdAt')
    .populate('senderId', 'name role');
  const unreadCount = await Message.countDocuments({
    conversationId: thread._id,
    senderId: { $ne: currentUserId },
    readBy: { $ne: currentUserId }
  });

  return {
    id: thread._id.toString(),
    counterpartName,
    counterpartRole,
    productTitle: thread.productId?.title || 'Product conversation',
    preview: latestMessage?.text || '',
    status: unreadCount ? 'Respond' : 'Resolved',
    time: latestMessage?.createdAt || thread.updatedAt,
    unreadCount,
    latestSender: latestMessage?.senderId?.name || '',
    updatedAt: thread.updatedAt,
    createdAt: thread.createdAt
  };
};

exports.buildSellerConversationQuery = (sellerId) =>
  Conversation.find({ sellerId })
    .populate('buyerId', 'name email phone')
    .populate('productId', 'title');

exports.listSellerConversations = asyncHandler(async (req, res) => {
  const conversations = await exports.buildSellerConversationQuery(req.user.id);

  const threads = await Promise.all(
    conversations.map((thread) =>
      buildThreadPayload({
        thread,
        currentUserId: req.user.id,
        counterpartName: thread.buyerId?.name || thread.buyerId?.email || 'Guest shopper',
        counterpartRole: 'Buyer'
      })
    )
  );

  res.json({ threads });
});

exports.listBuyerConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ buyerId: req.user.id })
    .populate('sellerId', 'name email')
    .populate('productId', 'title');

  const threads = await Promise.all(
    conversations.map((thread) =>
      buildThreadPayload({
        thread,
        currentUserId: req.user.id,
        counterpartName: thread.sellerId?.name || thread.sellerId?.email || 'Vendor',
        counterpartRole: 'Vendor'
      })
    )
  );

  res.json({ threads });
});

exports.getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  const userId = req.user.id;
  const isParticipant =
    conversation.buyerId?.toString() === userId || conversation.sellerId?.toString() === userId;
  if (!isParticipant) {
    return res.status(403).json({ message: 'Not authorized to view this chat' });
  }
  const messages = await Message.find({ conversationId: conversation._id })
    .sort('createdAt')
    .populate('senderId', 'name role');
  res.json({ messages });
});

exports.startConversation = asyncHandler(async (req, res) => {
  const { productId, message } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required to message a seller' });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Provided product ID is invalid' });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const sellerId = product.sellerId?.toString();
  if (!sellerId) {
    return res.status(400).json({ message: 'This listing does not have an assigned seller yet' });
  }
  if (sellerId === req.user.id) {
    return res.status(400).json({ message: 'You cannot message yourself for this product' });
  }

  let conversation = await Conversation.findOne({ buyerId: req.user.id, sellerId, productId });
  if (!conversation) {
    conversation = await Conversation.create({ buyerId: req.user.id, sellerId, productId });
  } else {
    conversation.updatedAt = Date.now();
    await conversation.save();
  }

  await conversation.populate([
    { path: 'sellerId', select: 'name email avatar' },
    { path: 'productId', select: 'title' }
  ]);

  let initialMessage = null;
  if (message?.trim()) {
    initialMessage = await Message.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      text: message.trim()
    });
    await initialMessage.populate('senderId', 'name role');
  }

  res.status(initialMessage ? 201 : 200).json({
    conversation,
    message: initialMessage
  });
});
