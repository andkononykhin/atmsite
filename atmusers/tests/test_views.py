from django.core.urlresolvers import reverse

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

from atmusers.views import ATMUserViewSet
from atmusers.models import ATMUser

factory = APIRequestFactory()


class ATMUserTests(APITestCase):
    fixtures = ['db.dump.test.json']

    def test_api_create_atmuser(self):
        """
        Ensure we can create a new atmuser object.
        """
        users_num = ATMUser.objects.count()

        atmuser = ATMUser.objects.get(card='0000000000000000')  # get admin
        view = ATMUserViewSet.as_view({'post': 'create'})

        data = {'card': '7777777777777777', 'password': '7777', 'cash': 700}
        request = factory.post(reverse('atmuser-list'), data, format='json')

        force_authenticate(request, user=atmuser)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ATMUser.objects.count(), users_num + 1)

    def test_api_update_atmuser_cash_enough(self):
        """
        Ensure we can create a new atmuser object.
        """
        atmuser = ATMUser.objects.get(card='1111111111111111')
        view = ATMUserViewSet.as_view({'patch': 'partial_update'})

        cash = atmuser.cash
        withdrawal = cash - 1

        data = {'withdrawal': atmuser.cash - 1, 'card': atmuser.cash}
        request = factory.patch(reverse('atmuser-detail',
                                kwargs={'card': atmuser.card}),
                                data, format='json')

        force_authenticate(request, user=atmuser)
        response = view(request, card=atmuser.card)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        atmuser = ATMUser.objects.get(card='1111111111111111')
        self.assertEqual(atmuser.cash, cash - withdrawal)
