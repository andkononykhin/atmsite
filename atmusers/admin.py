from django.contrib import admin

from atmusers.models import ATMUser, Operation

admin.site.register(ATMUser)
admin.site.register(Operation)
