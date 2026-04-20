const router = require('express').Router();
const {
  listSellerConversations,
  listBuyerConversations,
  getConversationMessages,
  startConversation
} = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.post('/', protect, startConversation);
router.get('/seller', protect, authorizeRoles('seller', 'admin'), listSellerConversations);
router.get('/', protect, listBuyerConversations);
router.get('/:id/messages', protect, getConversationMessages);

module.exports = router;
