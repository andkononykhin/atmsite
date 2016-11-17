from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.shortcuts import render
from django.conf import settings
from django.views.generic import TemplateView

from rest_framework import status, views, permissions, viewsets, mixins
from rest_framework.response import Response
from concurrency.exceptions import RecordModifiedError


from atmusers.models import ATMUser, Operation
from atmusers.permissions import (
    ATMUserPermission,
    ATMUserOperationsPermission,
    OperationPermission
)
from atmusers.serializers import (
    ATMUserSerializer,
    OperationSerializer,
    NotEnoughCashError,
)


class IndexView(TemplateView):
    template_name = 'index.html' if settings.DEBUG else 'index.min.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['STATIC_URL'] = settings.STATIC_URL
        return context


class LoginView(views.APIView):

    def head(self, request, card=None, *args, **kwargs):

        # initial login check
        if card is None:
            if request.user.is_authenticated():
                return Response()
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)
        # login (first phase)
        else:
            try:
                atmuser = ATMUser.objects.get(card=card)
            except ATMUser.DoesNotExist:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            else:
                if atmuser.is_blocked:
                    return Response(status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response()

    def post(self, request, *args, **kwargs):
        card = request.data.get('card', None)
        password = request.data.get('password', None)

        # do not allow login before logout
        if request.user.is_authenticated():
            return Response({
                'status': 'NotLoggedOut',
                'message': 'Need to logout before login'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # login (second phase)
        atmuser = authenticate(card=card, password=password)

        if atmuser is not None:
            if atmuser.is_active:
                login(request, atmuser)
                return Response()
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This atmuser has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)


class BlockCardView(views.APIView):

    def post(self, request, *args, **kwargs):
        card = request.data.get('card', None)

        try:
            atmuser = ATMUser.objects.get(card=card)

            if not atmuser.is_blocked:
                atmuser.is_blocked = True
                atmuser.save()
                op = Operation(code=Operation.CARD_BLOCKED, atmuser=atmuser)
                op.save()

            return Response()
        except ATMUser.DoesNotExist:
            return Response({
                'status': 'UserDoesNotExists',
                'message': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)


class ATMUserViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    lookup_field = 'card'
    queryset = ATMUser.objects.all()
    serializer_class = ATMUserSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        ATMUserPermission,
    )

    def get_queryset(self):
        queryset = super(ATMUserViewSet, self).get_queryset()
        return (queryset if self.request.user.is_staff else
                queryset.filter(card=self.request.user.card))

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            return super(ATMUserViewSet, self).update(request, *args, **kwargs)
        except RecordModifiedError:
            return Response({
                'status': 'ConcurrencyConflit',
                'message': (
                    'Cash value has been changed by concurrent transaction'
                )
            }, status=status.HTTP_409_CONFLICT)
        except NotEnoughCashError:
            return Response({
                'status': 'NotEnoughCash',
                'message': 'Not enough cash'
            }, status=status.HTTP_400_BAD_REQUEST)


class ATMUserOperationsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Operation.objects.select_related('atmuser').all()
    serializer_class = OperationSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        ATMUserOperationsPermission,
    )

    def get_queryset(self):
        queryset = super(ATMUserOperationsViewSet, self).get_queryset()
        return queryset.filter(atmuser__card=self.kwargs['atmuser_card'])


class OperationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        permissions.IsAdminUser,
        OperationPermission,
    )
