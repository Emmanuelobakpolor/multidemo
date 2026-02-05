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
    Register a new user with PayPal account
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')

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

        # Get or create PayPal platform
        platform, _ = Platform.objects.get_or_create(name='PayPal')

        # Create user account
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=500.00,
            status='active'
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
def login(request):
    """
    Login user by email
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
        account = UserAccount.objects.filter(user=user).first()

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
    Get user by email
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user).first()

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

@api_view(['POST'])
def send_money(request, senderEmail):
    """
    Send money from one user to another
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

        # Get accounts
        sender_account = UserAccount.objects.filter(user=sender).first()
        recipient_account = UserAccount.objects.filter(user=recipient).first()

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
    Get all transactions for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user).first()
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
                'recipient': t.recipient,  # Changed from receiverId to recipient
                'amount': float(t.amount),
                'reason': t.reason,       # Changed from message to reason
                'transaction_type': t.transaction_type,  # Changed from type to transaction_type
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

        account = UserAccount.objects.filter(user=user).first()
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
    Get all PayPal users (admin functionality)
    """
    try:
        # Get PayPal platform
        PayPal_platform = Platform.objects.get(name='PayPal')
        # Get all user accounts associated with PayPal platform
        PayPal_accounts = UserAccount.objects.filter(platform=PayPal_platform)
        user_data = []
        for account in PayPal_accounts:
            user = account.user
            user_data.append({
                'id': str(user.id),
                'email': user.email,
                'fullName': f'{user.first_name} {user.last_name}',
                'balance': float(account.balance),
                'createdAt': user.date_joined.isoformat(),
                'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
            })

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def request_money(request, requesterEmail):
    """
    Request money from another user
    """
    try:
        recipientEmail = request.data.get('recipientEmail')
        amount = request.data.get('amount')
        message = request.data.get('message')

        # Find requester
        requester = User.objects.filter(email=requesterEmail).first()
        if not requester:
            return Response(
                {'success': False, 'error': 'Requester not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Find recipient
        recipient = User.objects.filter(email=recipientEmail).first()
        if not recipient:
            return Response(
                {'success': False, 'error': 'Recipient not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if requester.id == recipient.id:
            return Response(
                {'success': False, 'error': 'Cannot request money from yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get accounts
        requester_account = UserAccount.objects.filter(user=requester).first()
        recipient_account = UserAccount.objects.filter(user=recipient).first()

        if not requester_account or not recipient_account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create request transaction for both users
        Transaction.objects.create(
            account=requester_account,
            amount=amount,
            transaction_type='requested',
            status='pending',
            reason=message,
            recipient=recipientEmail
        )

        Transaction.objects.create(
            account=recipient_account,
            amount=amount,
            transaction_type='request_received',
            status='pending',
            reason=message,
            recipient=requesterEmail
        )

        return Response({'success': True, 'message': 'Money request sent successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_user_by_id(request, id):
    """
    Get user by ID (admin functionality)
    """
    try:
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account = UserAccount.objects.filter(user=user).first()

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

@api_view(['PUT'])
def update_user(request, id):
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

        account = UserAccount.objects.filter(user=user).first()
        if not account:
            return Response(
                {'success': False, 'error': 'User account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update user fields
        if 'email' in request.data:
            user.email = request.data['email']
            user.username = request.data['email']  # Assuming username is email
        if 'fullName' in request.data:
            name_parts = request.data['fullName'].split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Update account fields
        if 'balance' in request.data:
            account.balance = decimal.Decimal(request.data['balance'])
        if 'status' in request.data:
            account.status = request.data['status']

        user.save()
        account.save()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'balance': float(account.balance),
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
def delete_user(request, id):
    """
    Delete user and associated data (admin functionality)
    """
    try:
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Delete user (this will cascade to UserAccount and related models)
        user.delete()

        return Response({'success': True, 'message': 'User deleted successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def register_admin(request):
    """
    Register a new admin user with PayPal platform
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

        # Get or create PayPal platform
        platform, _ = Platform.objects.get_or_create(name='PayPal')

        # Create admin user account with higher starting balance
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=10000.00,  # Higher balance for admin
            status='active'
        )

        # Create crypto wallets (BTC and ETH)
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
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data, 'message': 'Admin user created successfully'})
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

        account = UserAccount.objects.filter(user=user).first()
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

        account = UserAccount.objects.filter(user=user).first()
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
        sender_account = UserAccount.objects.filter(user=sender).first()
        receiver_account = UserAccount.objects.filter(user=receiver).first()

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
        if email == "admin@PayPal.com":
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
