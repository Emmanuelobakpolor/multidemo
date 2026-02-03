from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import payflow_views
from . import cryptoport_views
from . import sendwave_views
from . import quickcash_views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'accounts', views.UserAccountViewSet)
router.register(r'crypto-wallets', views.CryptoWalletViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'platforms', views.PlatformViewSet)
router.register(r'crypto-currencies', views.CryptoCurrencyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # PayFlow API endpoints
    path('payflow/register', payflow_views.register),
    path('payflow/register-admin', payflow_views.register_admin),
    path('payflow/login', payflow_views.login),
    path('payflow/user/<str:email>', payflow_views.get_user_by_email),
    path('payflow/user/<str:email>/transactions', payflow_views.get_transactions),
    path('payflow/user/<str:senderEmail>/send', payflow_views.send_money),
    path('payflow/user/<str:requesterEmail>/request', payflow_views.request_money),
    path('payflow/admin/fund', payflow_views.fund_wallet),
    path('payflow/admin/users', payflow_views.get_all_users),
    path('payflow/admin/user/<str:id>', payflow_views.get_user_by_id),
    path('payflow/admin/user/<str:id>/update', payflow_views.update_user),
    path('payflow/admin/user/<str:id>/delete', payflow_views.delete_user),
    path('payflow/admin/user/<str:userId>/toggle-chat', payflow_views.toggle_chat),
    path('payflow/chat/status/<str:email>/', payflow_views.get_chat_status),
    path('payflow/chat/send/', payflow_views.send_message),
    path('payflow/chat/history/<str:email>/', payflow_views.get_chat_history),
    path('payflow/chat/unread/<str:email>/', payflow_views.get_unread_messages),
    path('payflow/chat/mark-read/<str:email>/', payflow_views.mark_messages_read),
    # CryptoPort API endpoints
    path('cryptoport/register', cryptoport_views.register_cryptoport_user),
    path('cryptoport/register-admin', cryptoport_views.register_admin_cryptoport),
    path('cryptoport/login', cryptoport_views.login_cryptoport_user),
    path('cryptoport/user/<str:email>', cryptoport_views.get_cryptoport_user),
    path('cryptoport/user/<str:email>/transactions', cryptoport_views.get_crypto_transactions),
    path('cryptoport/user/<str:email>/wallets', cryptoport_views.get_user_crypto_wallets),
    path('cryptoport/user/<str:senderEmail>/send', cryptoport_views.send_crypto),
    path('cryptoport/user/<str:email>/deposit', cryptoport_views.deposit_crypto),
    path('cryptoport/user/<str:email>/withdraw', cryptoport_views.withdraw_crypto),
    path('cryptoport/admin/users', cryptoport_views.get_all_cryptoport_users),
    path('cryptoport/admin/user/<str:id>', cryptoport_views.get_cryptoport_user_by_id),
    path('cryptoport/admin/user/<str:id>/update', cryptoport_views.update_cryptoport_user),
    path('cryptoport/admin/user/<str:id>/delete', cryptoport_views.delete_cryptoport_user),
    path('cryptoport/admin/fund', cryptoport_views.fund_cryptoport_wallet),
    path('cryptoport/admin/user/update-deposit-address', cryptoport_views.update_cryptoport_deposit_address),
    path('cryptoport/admin/user/<str:userId>/toggle-chat', cryptoport_views.toggle_chat),
    path('cryptoport/chat/status/<str:email>/', cryptoport_views.get_chat_status),
    path('cryptoport/chat/send/', cryptoport_views.send_message),
    path('cryptoport/chat/history/<str:email>/', cryptoport_views.get_chat_history),
    path('cryptoport/chat/unread/<str:email>/', cryptoport_views.get_unread_messages),
    path('cryptoport/chat/mark-read/<str:email>/', cryptoport_views.mark_messages_read),
    # SendWave API endpoints
    path('sendwave/register', sendwave_views.register),
    path('sendwave/register-admin', sendwave_views.register_admin),
    path('sendwave/login', sendwave_views.login),
    path('sendwave/user/search', sendwave_views.search_users_by_mobile),
    path('sendwave/user/<str:email>', sendwave_views.get_user_by_email),
     path('sendwave/user/<str:email>/transactions', sendwave_views.get_transactions),
     path('sendwave/user/mobile/<str:mobile>/transactions', sendwave_views.get_transactions_by_mobile),
     path('sendwave/user/mobile/<str:senderMobile>/send', sendwave_views.send_money),
     path('sendwave/user/mobile/<str:mobile>', sendwave_views.get_user_by_mobile),
    path('sendwave/admin/fund', sendwave_views.fund_wallet),
    path('sendwave/admin/users', sendwave_views.get_all_users),
    path('sendwave/admin/transactions', sendwave_views.get_all_transactions),
    path('sendwave/admin/adjust-balance', sendwave_views.adjust_user_balance),
    path('sendwave/admin/user/<str:id>', sendwave_views.get_user_by_id),
    path('sendwave/admin/user/<str:id>/update', sendwave_views.update_user),
    path('sendwave/admin/user/<str:id>/delete', sendwave_views.delete_user),
    # SendWave Chat API endpoints
    path('sendwave/admin/user/<str:userId>/toggle-chat', sendwave_views.toggle_chat),
    path('sendwave/chat/status/<str:email>/', sendwave_views.get_chat_status),
    path('sendwave/chat/send/', sendwave_views.send_message),
     path('sendwave/chat/history/<str:email>/', sendwave_views.get_chat_history),
     path('sendwave/chat/unread/<str:email>/', sendwave_views.get_unread_messages),
     path('sendwave/chat/mark-read/<str:email>/', sendwave_views.mark_messages_read),
     # QuickCash API endpoints
      path('quickcash/register', quickcash_views.register),
      path('quickcash/register-admin', quickcash_views.register_admin),
      path('quickcash/login', quickcash_views.login),
     path('quickcash/user/<str:email>', quickcash_views.get_user_by_email),
     path('quickcash/user/<str:email>/transactions', quickcash_views.get_transactions),
     path('quickcash/search', quickcash_views.search_users),
     path('quickcash/user/<str:senderEmail>/send', quickcash_views.send_money),
     path('quickcash/admin/fund', quickcash_views.fund_wallet),
     path('quickcash/admin/users', quickcash_views.get_all_users),
     path('quickcash/admin/transactions', quickcash_views.get_all_transactions),
     path('quickcash/admin/edit-user', quickcash_views.edit_user),
      # QuickCash Chat API endpoints
      path('quickcash/chat/status/<str:email>/', quickcash_views.get_chat_status),
      path('quickcash/chat/send/', quickcash_views.send_message),
      path('quickcash/chat/history/<str:email>/', quickcash_views.get_chat_history),
      path('quickcash/chat/unread/<str:email>/', quickcash_views.get_unread_messages_count),
      path('quickcash/chat/mark-read/<str:email>/', quickcash_views.mark_messages_read),
      path('quickcash/admin/user/<str:userId>/toggle-chat', quickcash_views.toggle_chat),
]
