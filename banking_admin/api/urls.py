from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import paypal_views
from . import binance_views
from . import gcash_views
from . import cashapp_views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'accounts', views.UserAccountViewSet)
router.register(r'crypto-wallets', views.CryptoWalletViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'platforms', views.PlatformViewSet)
router.register(r'crypto-currencies', views.CryptoCurrencyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # PayPal API endpoints
    path('paypal/register', paypal_views.register),
    path('paypal/register-admin', paypal_views.register_admin),
    path('paypal/login', paypal_views.login),
    path('paypal/user/<str:email>', paypal_views.get_user_by_email),
    path('paypal/user/<str:email>/transactions', paypal_views.get_transactions),
    path('paypal/user/<str:senderEmail>/send', paypal_views.send_money),
    path('paypal/user/<str:requesterEmail>/request', paypal_views.request_money),
    path('paypal/admin/fund', paypal_views.fund_wallet),
    path('paypal/admin/users', paypal_views.get_all_users),
    path('paypal/admin/user/<str:id>', paypal_views.get_user_by_id),
    path('paypal/admin/user/<str:id>/update', paypal_views.update_user),
    path('paypal/admin/user/<str:id>/delete', paypal_views.delete_user),
    path('paypal/admin/user/<str:userId>/toggle-chat', paypal_views.toggle_chat),
    path('paypal/chat/status/<str:email>/', paypal_views.get_chat_status),
    path('paypal/chat/send/', paypal_views.send_message),
    path('paypal/chat/history/<str:email>/', paypal_views.get_chat_history),
    path('paypal/chat/unread/<str:email>/', paypal_views.get_unread_messages),
    path('paypal/chat/mark-read/<str:email>/', paypal_views.mark_messages_read),
    # Binance API endpoints
    path('binance/register', binance_views.register_binance_user),
    path('binance/register-admin', binance_views.register_admin_binance),
    path('binance/login', binance_views.login_binance_user),
    path('binance/user/<str:email>', binance_views.get_binance_user),
    path('binance/user/<str:email>/transactions', binance_views.get_crypto_transactions),
    path('binance/user/<str:email>/wallets', binance_views.get_user_crypto_wallets),
    path('binance/user/<str:senderEmail>/send', binance_views.send_crypto),
    path('binance/user/<str:email>/deposit', binance_views.deposit_crypto),
    path('binance/user/<str:email>/withdraw', binance_views.withdraw_crypto),
    path('binance/admin/users', binance_views.get_all_binance_users),
    path('binance/admin/user/<str:id>', binance_views.get_binance_user_by_id),
    path('binance/admin/user/<str:id>/update', binance_views.update_binance_user),
    path('binance/admin/user/<str:id>/delete', binance_views.delete_binance_user),
    path('binance/admin/fund', binance_views.fund_binance_wallet),
    path('binance/admin/user/update-deposit-address', binance_views.update_binance_deposit_address),
    path('binance/admin/user/<str:userId>/toggle-chat', binance_views.toggle_chat),
    path('binance/chat/status/<str:email>/', binance_views.get_chat_status),
    path('binance/chat/send/', binance_views.send_message),
    path('binance/chat/history/<str:email>/', binance_views.get_chat_history),
    path('binance/chat/unread/<str:email>/', binance_views.get_unread_messages),
    path('binance/chat/mark-read/<str:email>/', binance_views.mark_messages_read),
    # Binance Staking endpoints
    path('binance/staking/products', binance_views.get_staking_products),
    path('binance/user/<str:email>/stake', binance_views.stake_crypto),
    # Binance Savings endpoints
    path('binance/savings/products', binance_views.get_savings_products),
    path('binance/user/<str:email>/invest', binance_views.invest_savings),
    # Binance Security endpoints
    path('binance/user/<str:email>/toggle-2fa', binance_views.toggle_two_factor),
    path('binance/user/<str:email>/whitelist', binance_views.add_whitelist_address),
    path('binance/user/<str:email>/whitelist/addresses', binance_views.get_whitelist_addresses),
    # Binance Support endpoints
    path('binance/support/faqs', binance_views.get_faqs),
    path('binance/user/<str:email>/support/ticket', binance_views.create_support_ticket),
    path('binance/user/<str:email>/support/tickets', binance_views.get_support_tickets),
    # GCash API endpoints
    path('gcash/register', gcash_views.register),
    path('gcash/register-admin', gcash_views.register_admin),
    path('gcash/login', gcash_views.login),
    path('gcash/user/search', gcash_views.search_users_by_mobile),
    path('gcash/user/<str:email>', gcash_views.get_user_by_email),
     path('gcash/user/<str:email>/transactions', gcash_views.get_transactions),
     path('gcash/user/mobile/<str:mobile>/transactions', gcash_views.get_transactions_by_mobile),
     path('gcash/user/mobile/<str:senderMobile>/send', gcash_views.send_money),
     path('gcash/user/mobile/<str:mobile>', gcash_views.get_user_by_mobile),
    path('gcash/admin/fund', gcash_views.fund_wallet),
    path('gcash/admin/users', gcash_views.get_all_users),
    path('gcash/admin/transactions', gcash_views.get_all_transactions),
    path('gcash/admin/adjust-balance', gcash_views.adjust_user_balance),
    path('gcash/admin/user/<str:id>', gcash_views.get_user_by_id),
    path('gcash/admin/user/<str:id>/update', gcash_views.update_user),
    path('gcash/admin/user/<str:id>/delete', gcash_views.delete_user),
    # GCash Chat API endpoints
    path('gcash/admin/user/<str:userId>/toggle-chat', gcash_views.toggle_chat),
    path('gcash/chat/status/<str:email>/', gcash_views.get_chat_status),
    path('gcash/chat/send/', gcash_views.send_message),
     path('gcash/chat/history/<str:email>/', gcash_views.get_chat_history),
     path('gcash/chat/unread/<str:email>/', gcash_views.get_unread_messages),
     path('gcash/chat/mark-read/<str:email>/', gcash_views.mark_messages_read),
     # CashApp API endpoints
      path('cashapp/register', cashapp_views.register),
      path('cashapp/register-admin', cashapp_views.register_admin),
      path('cashapp/login', cashapp_views.login),
     path('cashapp/user/<str:email>', cashapp_views.get_user_by_email),
     path('cashapp/user/<str:email>/transactions', cashapp_views.get_transactions),
     path('cashapp/search', cashapp_views.search_users),
     path('cashapp/user/<str:senderEmail>/send', cashapp_views.send_money),
     path('cashapp/admin/fund', cashapp_views.fund_wallet),
     path('cashapp/admin/users', cashapp_views.get_all_users),
     path('cashapp/admin/transactions', cashapp_views.get_all_transactions),
     path('cashapp/admin/edit-user', cashapp_views.edit_user),
      # CashApp Chat API endpoints
      path('cashapp/chat/status/<str:email>/', cashapp_views.get_chat_status),
      path('cashapp/chat/send/', cashapp_views.send_message),
      path('cashapp/chat/history/<str:email>/', cashapp_views.get_chat_history),
      path('cashapp/chat/unread/<str:email>/', cashapp_views.get_unread_messages_count),
      path('cashapp/chat/mark-read/<str:email>/', cashapp_views.mark_messages_read),
      path('cashapp/admin/user/<str:userId>/toggle-chat', cashapp_views.toggle_chat),
]
