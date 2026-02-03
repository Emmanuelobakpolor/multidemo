from django.contrib import admin
from .models import Platform, UserAccount, Transaction, CryptoCurrency, CryptoWallet, ChatMessage

# Register your models here.
@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'platform', 'balance', 'status', 'chat_enabled')
    list_filter = ('platform', 'status', 'chat_enabled')
    search_fields = ('user__email', 'user__username')
    readonly_fields = ('user',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('account', 'amount', 'transaction_type', 'status', 'date')
    list_filter = ('transaction_type', 'status', 'date')
    search_fields = ('account__user__email', 'recipient')
    readonly_fields = ('account', 'date')

@admin.register(CryptoCurrency)
class CryptoCurrencyAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name')
    search_fields = ('symbol', 'name')

@admin.register(CryptoWallet)
class CryptoWalletAdmin(admin.ModelAdmin):
    list_display = ('account', 'crypto_currency', 'balance', 'deposit_address')
    list_filter = ('crypto_currency',)
    search_fields = ('account__user__email', 'deposit_address')
    readonly_fields = ('account',)

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'message', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('sender__email', 'receiver__email', 'message')
    readonly_fields = ('sender', 'receiver', 'timestamp')
