from rest_framework import serializers
from .models import ChatMessage, UserAccount, Transaction, User, CryptoWallet, CryptoCurrency, Platform

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = '__all__'

class CryptoCurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoCurrency
        fields = '__all__'

class CryptoWalletSerializer(serializers.ModelSerializer):
    crypto_currency_symbol = serializers.CharField(source='crypto_currency.symbol', read_only=True)
    class Meta:
        model = CryptoWallet
        fields = '__all__'

class UserAccountSerializer(serializers.ModelSerializer):
    platform_name = serializers.CharField(source='platform.name', read_only=True)
    crypto_wallets = CryptoWalletSerializer(many=True, read_only=True)
    class Meta:
        model = UserAccount
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    accounts = UserAccountSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'accounts']

class TransactionSerializer(serializers.ModelSerializer):
    account_username = serializers.CharField(source='account.user.username', read_only=True)
    platform_name = serializers.CharField(source='account.platform.name', read_only=True)
    crypto_symbol = serializers.CharField(source='crypto_wallet.crypto_currency.symbol', read_only=True)
    class Meta:
        model = Transaction
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    receiver_name = serializers.CharField(source='receiver.get_full_name', read_only=True)
    receiver_email = serializers.CharField(source='receiver.email', read_only=True)
    class Meta:
        model = ChatMessage
        fields = '__all__'
