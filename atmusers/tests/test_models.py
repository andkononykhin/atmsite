from django.test import TestCase
from atmusers.models import ATMUser, Operation


class ATMUserTest(TestCase):

    def test_atmuser_creation(self):
        atmuser = ATMUser.objects.create_user(card='card', password='pin', cash=1);
        self.assertTrue(isinstance(atmuser, ATMUser))
        self.assertEqual(atmuser.__unicode__(), atmuser.card)
        self.assertEqual(atmuser.get_full_name(), atmuser.card)
        self.assertEqual(atmuser.get_short_name(), atmuser.card)
        self.assertFalse(atmuser.is_staff)

    def test_atmuser_superuser_creation(self):
        atmuser = ATMUser.objects.create_superuser(card='card', password='pin');
        self.assertTrue(atmuser.is_staff)
        self.assertEqual(atmuser.cash, 0)

    def test_atmuser_nocard_creation(self):
        with self.assertRaises(ValueError, msg="Card can't be None"):
            atmuser = ATMUser.objects.create_user(card=None, password='pin');


class OperationTest(TestCase):

    def test_operation_creation(self):
        atmuser = ATMUser.objects.create_user(card='card', password='pin', cash=10);
        atmuser.save()
        operation = Operation.objects.create(code=Operation.WITHDRAWAL_SUCCESS,
                                                  atmuser=atmuser,
                                                  cash=9,
                                                  withdrawal=1,
                                                  add_info='Got cash');
        self.assertEqual(operation.__unicode__(),
                         '{0}: atmuser {1}, operation: {2}, time: {3}'.format(
                         operation.pk, operation.atmuser,
                         operation.OPERATION_CHOICES_DICT[operation.code],
                         operation.registered_at))

