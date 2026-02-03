from django.db import models
from django.contrib.auth.models import User

class Platform(models.Model):
    name = models.CharField(max_length=100)  # SendWave, CryptoPort, etc.

class UserAccount(models.Model):  # Renamed from UserProfile
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # One user can have multiple accounts
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Fiat balance for all, crypto for PayFlow/CryptoPort
    status = models.CharField(max_length=20, default='active')  # active, frozen
    chat_enabled = models.BooleanField(default=False)  # Support chat feature toggle
    mobile_number = models.CharField(max_length=15, blank=True, null=True)  # Mobile number for SendWave

class CryptoCurrency(models.Model):
    symbol = models.CharField(max_length=10, unique=True)  # BTC, ETH, etc.
    name = models.CharField(max_length=100)

class CryptoWallet(models.Model):
    account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='crypto_wallets')
    crypto_currency = models.ForeignKey(CryptoCurrency, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    deposit_address = models.CharField(max_length=200, unique=True)  # Unique deposit address per wallet

class Transaction(models.Model):
    account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='received_transactions')  # Linked to account, not user (for received)
    sender_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='sent_transactions', null=True, blank=True)  # Sender's account for tracking
    crypto_wallet = models.ForeignKey(CryptoWallet, on_delete=models.CASCADE, null=True, blank=True)  # For crypto transactions
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    transaction_type = models.CharField(max_length=20)  # sent, received, admin_adjusted, deposit, withdrawal
    status = models.CharField(max_length=20, default='completed')
    date = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True)
    recipient = models.CharField(max_length=200, blank=True)  # Email, phone, wallet address

class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
