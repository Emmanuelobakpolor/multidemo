from rest_framework.decorators import api_view
import decimal
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from .models import Platform, UserAccount, Transaction, CryptoWallet, CryptoCurrency, ChatMessage
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


@api_view(['POST'])
def register(request):
    """
    Register a new user with QuickCash account (Platform ID: 5)
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')
        mobileNumber = request.data.get('mobileNumber')

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'error': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Django user
        user = User.objects.create(
            username=email,
            email=email,
            password=make_password(password),
            first_name=fullName.split(' ')[0],
            last_name=' '.join(fullName.split(' ')[1:])
        )

        # Get or create QuickCash platform (Platform ID: 5)
        platform, _ = Platform.objects.get_or_create(id=5, defaults={'name': 'QuickCash'})

        # Create user account
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=100.00,
            status='active',
            mobile_number=mobileNumber
        )

        # Create crypto wallets (BTC and ETH)
        btc, _ = CryptoCurrency.objects.get_or_create(symbol='BTC', name='Bitcoin')
        eth, _ = CryptoCurrency.objects.get_or_create(symbol='ETH', name='Ethereum')

        CryptoWallet.objects.create(
            account=account,
            crypto_currency=btc,
            balance=0,
            deposit_address=f'mock-BTC-{user.id}-{account.id}'
        )

        CryptoWallet.objects.create(
            account=account,
            crypto_currency=eth,
            balance=0,
            deposit_address=f'mock-ETH-{user.id}-{account.id}'
        )

        # Return user data
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'balance': float(account.balance),
            'mobileNumber': account.mobile_number,
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
def register_admin(request):
    """
    Register a new admin user with QuickCash platform (Platform ID: 5)
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')
        adminCode = request.data.get('adminCode')

        # Check admin code (you can change this to a more secure method)
        if adminCode != 'QUICKCASHADMIN2024':
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

        # Get or create QuickCash platform (Platform ID: 5)
        platform, _ = Platform.objects.get_or_create(id=5, defaults={'name': 'QuickCash'})

        # Create admin user account with higher starting balance
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=10000.00,  # Higher balance for admin
            status='active',
            mobile_number=None  # Admin doesn't need mobile number
        )

        # Create crypto wallets (BTC and ETH) for admin
        btc, _ = CryptoCurrency.objects.get_or_create(symbol='BTC', name='Bitcoin')
        eth, _ = CryptoCurrency.objects.get_or_create(symbol='ETH', name='Ethereum')

        CryptoWallet.objects.create(
            account=account,
            crypto_currency=btc,
            balance=10,  # Starting crypto balance for admin
            deposit_address=f'admin-BTC-{user.id}-{account.id}'
        )

        CryptoWallet.objects.create(
            account=account,
            crypto_currency=eth,
            balance=100,  # Starting crypto balance for admin
            deposit_address=f'admin-ETH-{user.id}-{account.id}'
        )

        # Return admin user data
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'balance': float(account.balance),
            'mobileNumber': account.mobile_number,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'Admin user created successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login(request):
    """
    Login user by email for QuickCash
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

        # Get user account for QuickCash platform
        platform = Platform.objects.get(id=5)  # QuickCash platform is ID 5
        account = UserAccount.objects.filter(user=user, platform=platform).first()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'balance': float(account.balance) if account else 0,
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
def get_user_by_email(request, email):
    """
    Get user by email for QuickCash
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'balance': float(account.balance) if account else 0,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def search_users(request):
    """
    Search for QuickCash users by email, full name, or phone number
    """
    try:
        query = request.GET.get('query', '')
        if not query:
            return Response(
                {'success': False, 'error': 'Query parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        platform = Platform.objects.get(id=5)
        accounts = UserAccount.objects.filter(platform=platform)

        # Search users by full name, email, or phone number
        users_data = []
        for account in accounts:
            user = account.user
            match = False
            
            # Check full name
            full_name = f'{user.first_name} {user.last_name}'.lower()
            if query.lower() in full_name:
                match = True
            
            # Check email
            if query.lower() in user.email.lower():
                match = True
            
            # Check phone number
            if account.mobile_number and query in account.mobile_number:
                match = True
            
            # Check username/cashtag (if exists)
            # Note: Username/cashtag could be stored in a separate field in future versions
            
            if match:
                users_data.append({
                    'id': str(user.id),
                    'email': user.email,
                    'fullName': full_name,
                    'balance': float(account.balance),
                    'mobileNumber': account.mobile_number,
                    'createdAt': user.date_joined.isoformat(),
                    'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
                })

        return Response({'success': True, 'data': users_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def send_money(request, senderEmail):
    """
    Send money from one QuickCash user to another
    """
    try:
        recipientEmail = request.data.get('recipientEmail')
        amount = request.data.get('amount')
        message = request.data.get('message')

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
                {'success': False, 'error': 'Cannot send money to yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get QuickCash platform
        platform = Platform.objects.get(id=5)
        
        # Get accounts
        sender_account = UserAccount.objects.filter(user=sender, platform=platform).first()
        recipient_account = UserAccount.objects.filter(user=recipient, platform=platform).first()

        if not sender_account or not recipient_account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if sender_account.balance < decimal.Decimal(amount):
            return Response(
                {'success': False, 'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update balances
        sender_account.balance -= decimal.Decimal(amount)
        recipient_account.balance += decimal.Decimal(amount)
        sender_account.save()
        recipient_account.save()

        # Create transactions
        Transaction.objects.create(
            account=sender_account,
            amount=amount,
            transaction_type='sent',
            status='completed',
            reason=message,
            recipient=recipientEmail
        )

        Transaction.objects.create(
            account=recipient_account,
            amount=amount,
            transaction_type='received',
            status='completed',
            reason=message,
            recipient=senderEmail
        )

        return Response({'success': True, 'message': 'Money sent successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_transactions(request, email):
    """
    Get all transactions for a QuickCash user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()
        if not account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        transactions = Transaction.objects.filter(account=account)
        transaction_data = []
        for t in transactions:
            transaction_data.append({
                'id': str(t.id),
                'senderId': str(t.account.user.id),
                'recipient': t.recipient,
                'amount': float(t.amount),
                'reason': t.reason,
                'transaction_type': t.transaction_type,
                'status': t.status,
                'date': t.date.isoformat()
            })

        return Response({'success': True, 'data': transaction_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def fund_wallet(request):
    """
    Fund user wallet (admin functionality)
    """
    try:
        userId = request.data.get('userId')
        amount = request.data.get('amount')
        reason = request.data.get('reason')

        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()
        if not account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account.balance += decimal.Decimal(amount)
        account.save()

        Transaction.objects.create(
            account=account,
            amount=amount,
            transaction_type='admin_adjusted',
            status='completed',
            reason=reason,
            recipient='admin'
        )

        return Response({'success': True, 'message': 'Wallet funded successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_all_users(request):
    """
    Get all QuickCash users (admin functionality)
    """
    try:
        # Get QuickCash platform (ID: 5)
        quickcash_platform = Platform.objects.get(id=5)
        # Get all user accounts associated with QuickCash platform
        quickcash_accounts = UserAccount.objects.filter(platform=quickcash_platform)
        user_data = []
        for account in quickcash_accounts:
            user = account.user
            user_data.append({
                'id': str(user.id),
                'email': user.email,
                'fullName': f'{user.first_name} {user.last_name}',
                'balance': float(account.balance),
                'mobileNumber': account.mobile_number,
                'createdAt': user.date_joined.isoformat(),
                'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
            })

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_all_transactions(request):
    """
    Get all QuickCash transactions (admin functionality)
    """
    try:
        platform = Platform.objects.get(id=5)
        accounts = UserAccount.objects.filter(platform=platform)
        transactions = Transaction.objects.filter(account__in=accounts)
        
        transaction_data = []
        for t in transactions:
            transaction_data.append({
                'id': str(t.id),
                'senderId': str(t.account.user.id),
                'recipient': t.recipient,
                'amount': float(t.amount),
                'reason': t.reason,
                'transaction_type': t.transaction_type,
                'status': t.status,
                'date': t.date.isoformat()
            })

        return Response({'success': True, 'data': transaction_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def edit_user(request):
    """
    Edit user details (admin functionality)
    """
    try:
        userId = request.data.get('userId')
        fullName = request.data.get('fullName')
        email = request.data.get('email')
        mobileNumber = request.data.get('mobileNumber')

        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update user fields
        if email:
            user.email = email
            user.username = email
        if fullName:
            name_parts = fullName.split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Update account fields
        if mobileNumber:
            account.mobile_number = mobileNumber

        user.save()
        account.save()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'balance': float(account.balance),
            'mobileNumber': account.mobile_number,
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'User updated successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Chat functionality
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

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({'success': True, 'chat_enabled': account.chat_enabled})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_unread_messages_count(request, email):
    """
    Get unread messages count for a user
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

        return Response({'success': True, 'unread_count': unread_count})
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

        messages = ChatMessage.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('timestamp')

        message_data = []
        for msg in messages:
            message_data.append({
                'id': str(msg.id),
                'sender_email': msg.sender.email,
                'receiver_email': msg.receiver.email,
                'message': msg.message,
                'timestamp': msg.timestamp.isoformat(),
                'is_read': msg.is_read
            })

        return Response({'success': True, 'data': message_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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
                {'success': False, 'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        sender = User.objects.filter(email=sender_email).first()
        receiver = User.objects.filter(email=receiver_email).first()

        if not sender or not receiver:
            return Response(
                {'success': False, 'error': 'Sender or receiver not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            message=message,
            is_read=False
        )

        return Response({'success': True, 'message': 'Message sent successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def mark_messages_read(request, email):
    """
    Mark all messages as read for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        ChatMessage.objects.filter(
            receiver=user,
            is_read=False
        ).update(is_read=True)

        return Response({'success': True, 'message': 'Messages marked as read'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def toggle_chat(request, userId):
    """
    Toggle chat enabled/disabled for a user
    """
    try:
        user = User.objects.filter(id=userId).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        platform = Platform.objects.get(id=5)
        account = UserAccount.objects.filter(user=user, platform=platform).first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Toggle chat enabled status
        account.chat_enabled = not account.chat_enabled
        account.save()

        return Response({
            'success': True, 
            'chat_enabled': account.chat_enabled,
            'message': f'Chat {"enabled" if account.chat_enabled else "disabled"} successfully'
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
