from rest_framework.decorators import api_view
import decimal
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Platform, UserAccount, Transaction, CryptoWallet, CryptoCurrency, ChatMessage
from django.db.models import Q
from .serializers import (
    UserSerializer,
    UserAccountSerializer,
    TransactionSerializer,
    CryptoWalletSerializer,
    PlatformSerializer,
    CryptoCurrencySerializer,
    ChatMessageSerializer
)
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view


# Supported cryptocurrencies for CryptoPort
SUPPORTED_CRYPTOS = [
    {'symbol': 'BTC', 'name': 'Bitcoin'},
    {'symbol': 'ETH', 'name': 'Ethereum'},
    {'symbol': 'BNB', 'name': 'Binance Coin'},
    {'symbol': 'SOL', 'name': 'Solana'},
    {'symbol': 'ADA', 'name': 'Cardano'},
    {'symbol': 'DOT', 'name': 'Polkadot'},
    {'symbol': 'LINK', 'name': 'Chainlink'},
    {'symbol': 'UNI', 'name': 'Uniswap'},
]

@api_view(['POST'])
def register_cryptoport_user(request):
    """
    Register a new user with CryptoPort platform
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')
        username = request.data.get('username')

        # Check if user already exists
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return Response(
                {'success': False, 'error': 'User with this email or username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Django user
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            first_name=fullName.split(' ')[0],
            last_name=' '.join(fullName.split(' ')[1:])
        )

        # Get or create CryptoPort platform
        platform, _ = Platform.objects.get_or_create(name='CryptoPort')

        # Create user account with fiat balance for trading
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=1000.00,  # Starting fiat balance
            status='active'
        )

        # Create crypto currencies if they don't exist
        for crypto_data in SUPPORTED_CRYPTOS:
            CryptoCurrency.objects.get_or_create(
                symbol=crypto_data['symbol'],
                defaults={'name': crypto_data['name']}
            )

        # Create crypto wallets for each cryptocurrency
        crypto_currencies = CryptoCurrency.objects.all()
        for crypto in crypto_currencies:
            # Generate realistic-looking crypto addresses
            import random
            import string
            
            if crypto.symbol == 'BTC':
                # Bitcoin address format: 1 or 3 followed by base58 characters
                address = '1' + ''.join(random.choices(string.ascii_letters + string.digits, k=33))
            elif crypto.symbol == 'ETH':
                # Ethereum address format: 0x followed by 40 hex characters
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'BNB':
                # Binance Smart Chain address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'SOL':
                # Solana address format: base58 32-44 characters
                address = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            elif crypto.symbol == 'ADA':
                # Cardano address format: bech32 with addr prefix
                address = 'addr1' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=58))
            elif crypto.symbol == 'DOT':
                # Polkadot address format: base58 48 characters
                address = ''.join(random.choices(string.ascii_letters + string.digits, k=48))
            elif crypto.symbol == 'LINK':
                # Chainlink address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'UNI':
                # Uniswap address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            else:
                # Default format for other cryptos
                address = f'{crypto.symbol.lower()}-{user.id}-{account.id}-{crypto.id}'
            
            CryptoWallet.objects.create(
                account=account,
                crypto_currency=crypto,
                balance=0,
                deposit_address=address
            )

        # Return user data
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'username': email,  # Use email as username (as in User model)
            'fullName': f'{user.first_name} {user.last_name}',
            'fiatBalance': float(account.balance),
            'cryptoBalances': {crypto.symbol: 0 for crypto in crypto_currencies},
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'User created successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def login_cryptoport_user(request):
    """
    Login user for CryptoPort
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verify password
        if not user.check_password(password):
            return Response(
                {'success': False, 'error': 'Invalid password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get user account
        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get crypto balances
        crypto_wallets = CryptoWallet.objects.filter(account=account)
        crypto_balances = {wallet.crypto_currency.symbol: float(wallet.balance) for wallet in crypto_wallets}

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'username': user.username,  # Include username from User model
            'fullName': f'{user.first_name} {user.last_name}',
            'fiatBalance': float(account.balance),
            'cryptoBalances': crypto_balances,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'Login successful'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_cryptoport_user(request, email):
    """
    Get CryptoPort user by email
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get crypto balances
        crypto_wallets = CryptoWallet.objects.filter(account=account)
        crypto_balances = {wallet.crypto_currency.symbol: float(wallet.balance) for wallet in crypto_wallets}

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'username': user.username,  # Include username from User model
            'fullName': f'{user.first_name} {user.last_name}',
            'fiatBalance': float(account.balance),
            'cryptoBalances': crypto_balances,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def send_crypto(request, senderEmail):
    """
    Send crypto from one user to another
    """
    try:
        recipientEmail = request.data.get('recipientEmail')
        cryptoSymbol = request.data.get('cryptoSymbol')
        amount = request.data.get('amount')

        # Find sender
        sender = User.objects.filter(email=senderEmail).first()
        if not sender:
            return Response(
                {'success': False, 'error': 'Sender not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Find recipient
        recipient = User.objects.filter(email=recipientEmail).first()
        if not recipient:
            return Response(
                {'success': False, 'error': 'Recipient not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if sender.id == recipient.id:
            return Response(
                {'success': False, 'error': 'Cannot send crypto to yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get accounts
        sender_account = UserAccount.objects.filter(user=sender, platform__name='CryptoPort').first()
        recipient_account = UserAccount.objects.filter(user=recipient, platform__name='CryptoPort').first()

        if not sender_account or not recipient_account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get crypto wallets
        sender_wallet = CryptoWallet.objects.filter(account=sender_account, crypto_currency__symbol=cryptoSymbol).first()
        recipient_wallet = CryptoWallet.objects.filter(account=recipient_account, crypto_currency__symbol=cryptoSymbol).first()

        if not sender_wallet or not recipient_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if sender_wallet.balance < decimal.Decimal(amount):
            return Response(
                {'success': False, 'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update balances
        sender_wallet.balance -= decimal.Decimal(amount)
        recipient_wallet.balance += decimal.Decimal(amount)
        sender_wallet.save()
        recipient_wallet.save()

        # Create transactions
        Transaction.objects.create(
            account=sender_account,
            crypto_wallet=sender_wallet,
            amount=amount,
            transaction_type='crypto_sent',
            status='completed',
            reason=f'Sent {cryptoSymbol} to {recipientEmail}',
            recipient=recipientEmail
        )

        Transaction.objects.create(
            account=recipient_account,
            crypto_wallet=recipient_wallet,
            amount=amount,
            transaction_type='crypto_received',
            status='completed',
            reason=f'Received {cryptoSymbol} from {senderEmail}',
            recipient=senderEmail
        )

        return Response({'success': True, 'message': f'{amount} {cryptoSymbol} sent successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_crypto_transactions(request, email):
    """
    Get all crypto transactions for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        transactions = Transaction.objects.filter(account=account)
        transaction_data = []
        for t in transactions:
            crypto_symbol = t.crypto_wallet.crypto_currency.symbol if t.crypto_wallet else 'FIAT'
            transaction_data.append({
                'id': str(t.id),
                'cryptoSymbol': crypto_symbol,
                'amount': float(t.amount),
                'transaction_type': t.transaction_type,
                'status': t.status,
                'reason': t.reason,
                'recipient': t.recipient,
                'date': t.date.isoformat()
            })

        return Response({'success': True, 'data': transaction_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_user_crypto_wallets(request, email):
    """
    Get all crypto wallets and balances for user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallets = CryptoWallet.objects.filter(account=account)
        wallet_data = []
        for wallet in crypto_wallets:
            wallet_data.append({
                'id': str(wallet.id),
                'cryptoSymbol': wallet.crypto_currency.symbol,
                'cryptoName': wallet.crypto_currency.name,
                'balance': float(wallet.balance),
                'depositAddress': wallet.deposit_address
            })

        return Response({'success': True, 'data': wallet_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def deposit_crypto(request, email):
    """
    Simulate crypto deposit to user's wallet
    """
    try:
        cryptoSymbol = request.data.get('cryptoSymbol')
        amount = request.data.get('amount')

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet = CryptoWallet.objects.filter(account=account, crypto_currency__symbol=cryptoSymbol).first()
        if not crypto_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet.balance += decimal.Decimal(amount)
        crypto_wallet.save()

        Transaction.objects.create(
            account=account,
            crypto_wallet=crypto_wallet,
            amount=amount,
            transaction_type='crypto_deposit',
            status='completed',
            reason=f'Deposited {amount} {cryptoSymbol}',
            recipient='external_wallet'
        )

        return Response({'success': True, 'message': f'{amount} {cryptoSymbol} deposited successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['POST'])
def toggle_chat(request, userId):
    """
    Toggle chat feature for a user (admin functionality)
    """
    try:
        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account.chat_enabled = not account.chat_enabled
        account.save()

        return Response({
            'success': True,
            'message': f'Chat {"enabled" if account.chat_enabled else "disabled"} for user',
            'chat_enabled': account.chat_enabled
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_chat_status(request, email):
    """
    Get chat status for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'success': True,
            'chat_enabled': account.chat_enabled
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['POST'])
def send_message(request):
    """
    Send a chat message
    """
    try:
        sender_email = request.data.get('sender_email')
        receiver_email = request.data.get('receiver_email')
        message = request.data.get('message')

        if not sender_email or not receiver_email or not message:
            return Response(
                {'success': False, 'error': 'Sender email, receiver email, and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        sender = User.objects.filter(email=sender_email).first()
        receiver = User.objects.filter(email=receiver_email).first()

        if not sender or not receiver:
            return Response(
                {'success': False, 'error': 'Sender or receiver not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if chat is enabled for both users
        # For admin user, skip platform check
        if sender.email == "admin@cryptoport.com":
            # For receiver, must have CryptoPort account and chat enabled
            receiver_account = UserAccount.objects.filter(user=receiver, platform__name='CryptoPort').first()
            if not receiver_account:
                return Response(
                    {'success': False, 'error': 'User account not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            if not receiver_account.chat_enabled:
                return Response(
                    {'success': False, 'error': 'Chat is not enabled for the recipient'},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif receiver.email == "admin@cryptoport.com":
            # For sender, must have CryptoPort account and chat enabled
            sender_account = UserAccount.objects.filter(user=sender, platform__name='CryptoPort').first()
            if not sender_account:
                return Response(
                    {'success': False, 'error': 'User account not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            if not sender_account.chat_enabled:
                return Response(
                    {'success': False, 'error': 'Chat is not enabled for the sender'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            # For regular users, both must have CryptoPort accounts and chat enabled
            sender_account = UserAccount.objects.filter(user=sender, platform__name='CryptoPort').first()
            receiver_account = UserAccount.objects.filter(user=receiver, platform__name='CryptoPort').first()
            
            if not sender_account or not receiver_account:
                return Response(
                    {'success': False, 'error': 'User account not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if not sender_account.chat_enabled or not receiver_account.chat_enabled:
                return Response(
                    {'success': False, 'error': 'Chat is not enabled for one or both users'},
                    status=status.HTTP_403_FORBIDDEN
                )

        chat_message = ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )

        serializer = ChatMessageSerializer(chat_message)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Message sent successfully'
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_chat_history(request, email):
    """
    Get chat history for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get messages where user is either sender or receiver
        messages = ChatMessage.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('timestamp')

        serializer = ChatMessageSerializer(messages, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_unread_messages(request, email):
    """
    Get count of unread messages for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        unread_count = ChatMessage.objects.filter(
            receiver=user,
            is_read=False
        ).count()

        return Response({
            'success': True,
            'unread_count': unread_count
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['POST'])
def mark_messages_read(request, email):
    """
    Mark messages as read for a user or admin
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # If admin is marking messages as read, we need to know which user's messages to mark
        if email == "admin@cryptoport.com":
            user_email = request.data.get('user_email')
            if user_email:
                # Mark all unread messages from specific user to admin
                ChatMessage.objects.filter(
                    sender__email=user_email,
                    receiver=user,
                    is_read=False
                ).update(is_read=True)
            else:
                # Mark all unread messages to admin
                ChatMessage.objects.filter(
                    receiver=user,
                    is_read=False
                ).update(is_read=True)
        else:
            # For regular users, mark all unread messages from admin
            ChatMessage.objects.filter(
                receiver=user,
                is_read=False
            ).update(is_read=True)

        return Response({
            'success': True,
            'message': 'Messages marked as read'
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def withdraw_crypto(request, email):
    """
    Withdraw crypto from user's wallet
    """
    try:
        cryptoSymbol = request.data.get('cryptoSymbol')
        amount = request.data.get('amount')
        withdrawalAddress = request.data.get('withdrawalAddress')

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet = CryptoWallet.objects.filter(account=account, crypto_currency__symbol=cryptoSymbol).first()
        if not crypto_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if crypto_wallet.balance < decimal.Decimal(amount):
            return Response(
                {'success': False, 'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Simulate network fee (0.001 for most cryptos)
        network_fee = decimal.Decimal('0.001')
        total_deduction = decimal.Decimal(amount) + network_fee

        if crypto_wallet.balance < total_deduction:
            return Response(
                {'success': False, 'error': 'Insufficient balance including network fee'},
                status=status.HTTP_400_BAD_REQUEST
            )

        crypto_wallet.balance -= total_deduction
        crypto_wallet.save()

        Transaction.objects.create(
            account=account,
            crypto_wallet=crypto_wallet,
            amount=amount,
            transaction_type='crypto_withdrawal',
            status='completed',
            reason=f'Withdrew {amount} {cryptoSymbol} to {withdrawalAddress}',
            recipient=withdrawalAddress
        )

        return Response({'success': True, 'message': f'{amount} {cryptoSymbol} withdrawn successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Admin functions
@api_view(['GET'])
def get_all_cryptoport_users(request):
    """
    Get all CryptoPort users (admin functionality)
    """
    try:
        users = User.objects.all()
        user_data = []
        for user in users:
            account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
            if account:
                # Get crypto balances
                crypto_wallets = CryptoWallet.objects.filter(account=account)
                crypto_balances = {wallet.crypto_currency.symbol: float(wallet.balance) for wallet in crypto_wallets}

                user_data.append({
                    'id': str(user.id),
                    'email': user.email,
                    'fullName': f'{user.first_name} {user.last_name}',
                    'fiatBalance': float(account.balance),
                    'cryptoBalances': crypto_balances,
                    'status': account.status,
                    'chat_enabled': account.chat_enabled,
                    'createdAt': user.date_joined.isoformat(),
                    'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
                })

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
def update_user_crypto_balance(request, userId):
    """
    Admin: Adjust user's crypto balance
    """
    try:
        cryptoSymbol = request.data.get('cryptoSymbol')
        newBalance = request.data.get('newBalance')

        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet = CryptoWallet.objects.filter(account=account, crypto_currency__symbol=cryptoSymbol).first()
        if not crypto_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        old_balance = crypto_wallet.balance
        crypto_wallet.balance = decimal.Decimal(newBalance)
        crypto_wallet.save()

        # Create admin adjustment transaction
        Transaction.objects.create(
            account=account,
            crypto_wallet=crypto_wallet,
            amount=decimal.Decimal(newBalance) - old_balance,
            transaction_type='admin_adjusted',
            status='completed',
            reason=f'Admin adjusted {cryptoSymbol} balance from {old_balance} to {newBalance}',
            recipient='admin'
        )

        return Response({'success': True, 'message': f'{cryptoSymbol} balance updated successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_cryptoport_user_by_id(request, id):
    """
    Get CryptoPort user by ID (admin functionality)
    """
    try:
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get crypto balances
        crypto_wallets = CryptoWallet.objects.filter(account=account)
        crypto_balances = {wallet.crypto_currency.symbol: float(wallet.balance) for wallet in crypto_wallets}

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'fiatBalance': float(account.balance),
            'cryptoBalances': crypto_balances,
            'status': account.status,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_cryptoport_user(request, id):
    """
    Update user details (admin functionality)
    """
    try:
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update user fields
        if 'email' in request.data:
            user.email = request.data['email']
            user.username = request.data['email']
        if 'fullName' in request.data:
            name_parts = request.data['fullName'].split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Update account fields
        if 'fiatBalance' in request.data:
            account.balance = decimal.Decimal(request.data['fiatBalance'])
        if 'status' in request.data:
            account.status = request.data['status']

        user.save()
        account.save()

        # Get updated crypto balances
        crypto_wallets = CryptoWallet.objects.filter(account=account)
        crypto_balances = {wallet.crypto_currency.symbol: float(wallet.balance) for wallet in crypto_wallets}

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'fiatBalance': float(account.balance),
            'cryptoBalances': crypto_balances,
            'status': account.status,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'User updated successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_cryptoport_user(request, id):
    """
    Delete user (admin functionality)
    """
    try:
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get user account
        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if account:
            # Delete associated crypto wallets and transactions
            CryptoWallet.objects.filter(account=account).delete()
            Transaction.objects.filter(account=account).delete()
            # Delete the account
            account.delete()

        # Delete the user
        user.delete()

        return Response({'success': True, 'message': 'User deleted successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def fund_cryptoport_wallet(request):
    """
    Fund user wallet (admin functionality)
    """
    try:
        userId = request.data.get('userId')
        cryptoSymbol = request.data.get('cryptoSymbol')
        amount = request.data.get('amount')
        reason = request.data.get('reason')

        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet = CryptoWallet.objects.filter(account=account, crypto_currency__symbol=cryptoSymbol).first()
        if not crypto_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet.balance += decimal.Decimal(amount)
        crypto_wallet.save()

        Transaction.objects.create(
            account=account,
            crypto_wallet=crypto_wallet,
            amount=amount,
            transaction_type='admin_adjusted',
            status='completed',
            reason=reason,
            recipient='admin'
        )

        return Response({'success': True, 'message': f'{amount} {cryptoSymbol} added to wallet successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def update_cryptoport_deposit_address(request):
    """
    Admin: Change user's crypto deposit address
    """
    try:
        userId = request.data.get('userId')
        cryptoSymbol = request.data.get('cryptoSymbol')
        depositAddress = request.data.get('depositAddress')

        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user, platform__name='CryptoPort').first()
        if not account:
            return Response(
                {'success': False, 'error': 'CryptoPort account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet = CryptoWallet.objects.filter(account=account, crypto_currency__symbol=cryptoSymbol).first()
        if not crypto_wallet:
            return Response(
                {'success': False, 'error': 'Crypto wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        crypto_wallet.deposit_address = depositAddress
        crypto_wallet.save()

        return Response({'success': True, 'message': f'{cryptoSymbol} deposit address updated successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def register_admin_cryptoport(request):
    """
    Register a new admin user with CryptoPort platform
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')
        adminCode = request.data.get('adminCode')

        # Check admin code (you can change this to a more secure method)
        if adminCode != 'ADMIN2024':
            return Response(
                {'success': False, 'error': 'Invalid admin registration code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'error': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Django admin user
        user = User.objects.create(
            username=email,
            email=email,
            password=make_password(password),
            first_name=fullName.split(' ')[0],
            last_name=' '.join(fullName.split(' ')[1:]),
            is_staff=True,
            is_superuser=True
        )

        # Get or create CryptoPort platform
        platform, _ = Platform.objects.get_or_create(name='CryptoPort')

        # Create admin user account with higher starting fiat balance
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=10000.00,  # Higher fiat balance for admin
            status='active'
        )

        # Create crypto currencies if they don't exist
        for crypto_data in SUPPORTED_CRYPTOS:
            CryptoCurrency.objects.get_or_create(
                symbol=crypto_data['symbol'],
                defaults={'name': crypto_data['name']}
            )

        # Create crypto wallets for each cryptocurrency with starting balances for admin
        crypto_currencies = CryptoCurrency.objects.all()
        for crypto in crypto_currencies:
            # Generate realistic-looking crypto addresses
            import random
            import string

            if crypto.symbol == 'BTC':
                # Bitcoin address format: 1 or 3 followed by base58 characters
                address = '1' + ''.join(random.choices(string.ascii_letters + string.digits, k=33))
            elif crypto.symbol == 'ETH':
                # Ethereum address format: 0x followed by 40 hex characters
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'BNB':
                # Binance Smart Chain address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'SOL':
                # Solana address format: base58 32-44 characters
                address = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            elif crypto.symbol == 'ADA':
                # Cardano address format: bech32 with addr prefix
                address = 'addr1' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=58))
            elif crypto.symbol == 'DOT':
                # Polkadot address format: base58 48 characters
                address = ''.join(random.choices(string.ascii_letters + string.digits, k=48))
            elif crypto.symbol == 'LINK':
                # Chainlink address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            elif crypto.symbol == 'UNI':
                # Uniswap address (same format as Ethereum)
                address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
            else:
                # Default format for other cryptos
                address = f'admin-{crypto.symbol.lower()}-{user.id}-{account.id}'

            # Set starting balances for admin
            starting_balance = 0
            if crypto.symbol == 'BTC':
                starting_balance = 10
            elif crypto.symbol == 'ETH':
                starting_balance = 100

            CryptoWallet.objects.create(
                account=account,
                crypto_currency=crypto,
                balance=starting_balance,
                deposit_address=address
            )

        # Return admin user data
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'fiatBalance': float(account.balance),
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'Admin user created successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
