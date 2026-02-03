from rest_framework import viewsets, status
import decimal
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import UserAccount, Transaction, User, CryptoWallet, Platform, CryptoCurrency
from .serializers import (
    UserAccountSerializer, 
    TransactionSerializer, 
    UserSerializer, 
    CryptoWalletSerializer,
    PlatformSerializer,
    CryptoCurrencySerializer
)

class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer

class CryptoCurrencyViewSet(viewsets.ModelViewSet):
    queryset = CryptoCurrency.objects.all()
    serializer_class = CryptoCurrencySerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(email__iexact=email)
        return queryset

class UserAccountViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer

    @action(detail=True, methods=['post'])
    def adjust_balance(self, request, pk=None):
        account = self.get_object()
        amount = request.data.get('amount')
        reason = request.data.get('reason', '')
        account.balance += decimal.Decimal(amount)
        account.save()
        Transaction.objects.create(
            account=account,
            amount=amount,
            transaction_type='admin_adjusted',
            reason=reason
        )
        return Response({'status': 'Balance adjusted'})

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        account = self.get_object()
        account.status = 'frozen' if account.status == 'active' else 'active'
        account.save()
        return Response({'status': account.status})

    @action(detail=True, methods=['post'])
    def update_crypto_address(self, request, pk=None):
        account = self.get_object()
        crypto_symbol = request.data.get('crypto_symbol')
        new_address = request.data.get('new_address')
        try:
            wallet = CryptoWallet.objects.get(account=account, crypto_currency__symbol=crypto_symbol)
            wallet.deposit_address = new_address
            wallet.save()
            return Response({'status': 'Address updated'})
        except CryptoWallet.DoesNotExist:
            return Response({'error': 'Crypto wallet not found'}, status=404)

class CryptoWalletViewSet(viewsets.ModelViewSet):
    queryset = CryptoWallet.objects.all()
    serializer_class = CryptoWalletSerializer

    @action(detail=True, methods=['post'])
    def adjust_balance(self, request, pk=None):
        wallet = self.get_object()
        amount = request.data.get('amount')
        reason = request.data.get('reason', '')
        wallet.balance += decimal.Decimal(amount)
        wallet.save()
        Transaction.objects.create(
            account=wallet.account,
            crypto_wallet=wallet,
            amount=amount,
            transaction_type='admin_adjusted',
            reason=reason
        )
        return Response({'status': 'Crypto balance adjusted'})

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        account_id = self.request.query_params.get('account')
        if account_id:
            queryset = queryset.filter(account_id=account_id)
        return queryset

    # Full CRUD is already provided by ModelViewSet
    # Additional actions can be added here if needed
