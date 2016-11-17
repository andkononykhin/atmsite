from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from concurrency.fields import ConditionalVersionField


class ATMUserManager(BaseUserManager):

    def _create_user(self, card, password, is_staff,
                     is_superuser, cash, **kwargs):
        """
        """
        if not card:
            raise ValueError('The given card number must be specified')
        user = self.model(card=card,
                          password=password,
                          is_staff=is_staff,
                          is_superuser=is_superuser,
                          cash=cash, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, card, password, cash=0, **kwargs):
        return self._create_user(card, password, False, False, cash, **kwargs)

    def create_superuser(self, card, password, **kwargs):
        return self._create_user(card, password, True, True, 0, **kwargs)


class ATMUser(AbstractBaseUser, PermissionsMixin):

    card = models.CharField(max_length=16, unique=True)
    cash = models.PositiveIntegerField(default=0)

    is_blocked = models.BooleanField(default=False)

    version = ConditionalVersionField()

    class ConcurrencyMeta:
        check_fields = ('cash',)

    objects = ATMUserManager()

    USERNAME_FIELD = 'card'

    def __unicode__(self):
        return self.card

    def get_full_name(self):
        return self.card

    def get_short_name(self):
        return self.card

    @property
    def is_staff(self):
        return self.is_superuser


class Operation(models.Model):

    # auth related
    CARD_CREATED = 1
    CARD_BLOCKED = 2

    # cash related
    WITHDRAWAL_SUCCESS = 10
    WITHDRAWAL_FAILURE_NOCASH = 11

    OPERATION_CHOICES = (
        (CARD_CREATED, 'Card created'),
        (CARD_BLOCKED, 'Card blocked'),
        (WITHDRAWAL_SUCCESS, 'Cash withdrawal'),
        (WITHDRAWAL_FAILURE_NOCASH, 'Not enough cash'),
    )

    OPERATION_CHOICES_DICT = {k: v for (k, v) in OPERATION_CHOICES}

    code = models.PositiveSmallIntegerField(choices=OPERATION_CHOICES)

    registered_at = models.DateTimeField(auto_now_add=True)

    atmuser = models.ForeignKey(ATMUser,
                                blank=True,
                                null=True,
                                on_delete=models.SET_NULL,
                                related_name='operations')

    withdrawal = models.PositiveSmallIntegerField(null=True)

    cash = models.PositiveSmallIntegerField(null=True)

    add_info = models.CharField(max_length=100, null=True)

    def __unicode__(self):
        return ('%d: atmuser %s, operation: %s, time: %s' %
                (self.pk, self.atmuser,
                 self.OPERATION_CHOICES_DICT[self.code],
                 self.registered_at))
