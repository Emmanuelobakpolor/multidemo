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
    Register a new user with SendWave account
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

        # Check if mobile number already exists
        if UserAccount.objects.filter(mobile_number=mobileNumber, platform__name='SendWave').exists():
            return Response(
                {'success': False, 'error': 'Mobile number already registered'},
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

        # Get or create SendWave platform
        platform, _ = Platform.objects.get_or_create(name='SendWave')

        # Create user account
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=500.00,
            status='active',
            mobile_number=mobileNumber
        )

        # Return user data
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'mobileNumber': account.mobile_number,
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
        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'mobileNumber': account.mobile_number if account else None,
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'mobileNumber': account.mobile_number if account else None,
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
def search_users_by_mobile(request):
    """
    Search users by mobile number (partial match for autocomplete)
    """
    try:
        query = request.query_params.get('q', '')
        if not query:
            return Response({'success': True, 'data': []})
        
        # Search for users with matching mobile number
        accounts = UserAccount.objects.filter(
            mobile_number__icontains=query,
            platform__name='SendWave'
        )[:10]  # Limit to 10 results
        
        user_data = []
        for account in accounts:
            user = account.user
            user_data.append({
                'id': str(user.id),
                'email': user.email,
                'fullName': f'{user.first_name} {user.last_name}',
                'mobileNumber': account.mobile_number,
            })
        
        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_user_by_mobile(request, mobile):
    """
    Get user by mobile number for SendWave
    """
    try:
        account = UserAccount.objects.filter(mobile_number=mobile, platform__name='SendWave').first()
        if not account:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = account.user

        user_data = {
            'id': str(user.id),
            'email': user.email,
            'fullName': f'{user.first_name} {user.last_name}',
            'mobileNumber': account.mobile_number,
            'balance': float(account.balance),
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
def send_money(request, senderMobile):
    """
    Send money from one user to another
    """
    try:
        recipientMobile = request.data.get('recipientMobile')
        amount = request.data.get('amount')
        message = request.data.get('message')

        # Find sender by mobile number
        sender_account = UserAccount.objects.filter(mobile_number=senderMobile, platform__name='SendWave').first()
        if not sender_account:
            return Response(
                {'success': False, 'error': 'Sender not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        sender = sender_account.user

        # Find recipient by mobile number
        recipient_account = UserAccount.objects.filter(mobile_number=recipientMobile, platform__name='SendWave').first()
        if not recipient_account:
            return Response(
                {'success': False, 'error': 'Recipient not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        recipient = recipient_account.user

        if sender.id == recipient.id:
            return Response(
                {'success': False, 'error': 'Cannot send money to yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get accounts
        sender_account = UserAccount.objects.filter(user=sender, platform__name='SendWave').first()
        recipient_account = UserAccount.objects.filter(user=recipient, platform__name='SendWave').first()

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
            recipient=recipientMobile
        )

        Transaction.objects.create(
            account=recipient_account,
            amount=amount,
            transaction_type='received',
            status='completed',
            reason=message,
            recipient=senderMobile
        )

        return Response({'success': True, 'message': 'Money sent successfully'})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_transactions_by_mobile(request, mobile):
    """
    Get all transactions for a user by mobile number
    """
    try:
        account = UserAccount.objects.filter(mobile_number=mobile, platform__name='SendWave').first()
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
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
    Get all SendWave users (admin functionality)
    """
    try:
        # Get SendWave platform
        sendwave_platform = Platform.objects.get(name='SendWave')
        # Get all user accounts associated with SendWave platform
        sendwave_accounts = UserAccount.objects.filter(platform=sendwave_platform)
        user_data = []
        for account in sendwave_accounts:
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

@api_view(['GET'])
def get_all_transactions(request):
    """
    Get all SendWave transactions (admin functionality)
    """
    try:
        # Get SendWave platform
        sendwave_platform = Platform.objects.get(name='SendWave')
        # Get all user accounts associated with SendWave platform
        sendwave_accounts = UserAccount.objects.filter(platform=sendwave_platform)
        # Get all transactions for SendWave accounts
        transactions = Transaction.objects.filter(account__in=sendwave_accounts)
        transaction_data = []
        for t in transactions:
            transaction_data.append({
                'id': str(t.id),
                'senderId': str(t.account.user.id),
                'senderEmail': t.account.user.email,
                'senderFullName': f'{t.account.user.first_name} {t.account.user.last_name}',
                'recipient': t.recipient,
                'amount': float(t.amount),
                'reason': t.reason,
                'transaction_type': t.transaction_type,
                'status': t.status,
                'date': t.date.isoformat()
            })

        # Sort transactions by date (newest first)
        transaction_data.sort(key=lambda x: x['date'], reverse=True)

        return Response({'success': True, 'data': transaction_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def adjust_user_balance(request):
    """
    Adjust user balance (admin functionality)
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
        if not account:
            return Response(
                {'success': False, 'error': 'Account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        account.balance += decimal.Decimal(amount)
        account.save()

        Transaction.objects.create(
            account=account,
            amount=abs(decimal.Decimal(amount)),
            transaction_type='admin_adjusted',
            status='completed',
            reason=reason,
            recipient='admin'
        )

        return Response({'success': True, 'message': 'User balance adjusted successfully'})
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()

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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
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
            'createdAt': user.date_joined.isoformat(),
            'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat()
        }

        return Response({'success': True, 'data': user_data})
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
def delete_user(request, id):
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

        # Delete user and associated accounts and transactions
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
    Register a new admin user with SendWave platform
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        fullName = request.data.get('fullName')
        adminCode = request.data.get('adminCode')

        # Check admin code (you can change this to a more secure method)
        if adminCode != 'SENDWAVEADMIN2024':
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

        # Get or create SendWave platform
        platform, _ = Platform.objects.get_or_create(name='SendWave')

        # Create admin user account with higher starting balance
        account = UserAccount.objects.create(
            user=user,
            platform=platform,
            balance=10000.00,  # Higher balance for admin
            status='active',
            mobile_number=None  # Admin doesn't need mobile number
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

# ==================== CHAT FEATURE ENDPOINTS ====================

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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
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

        account = UserAccount.objects.filter(user=user, platform__name='SendWave').first()
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
        if sender.email == "admin@sendwave.com":
            # For receiver, must have SendWave account and chat enabled
            receiver_account = UserAccount.objects.filter(user=receiver, platform__name='SendWave').first()
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
        elif receiver.email == "admin@sendwave.com":
            # For sender, must have SendWave account and chat enabled
            sender_account = UserAccount.objects.filter(user=sender, platform__name='SendWave').first()
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
            # For regular users, both must have SendWave accounts and chat enabled
            sender_account = UserAccount.objects.filter(user=sender, platform__name='SendWave').first()
            receiver_account = UserAccount.objects.filter(user=receiver, platform__name='SendWave').first()
            
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
    Mark all messages as read for a user
    """
    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {'success': False, 'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark all unread messages as read
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
