from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from atmusers.models import ATMUser, Operation


class NotEnoughCashError(Exception):
    pass


class ATMUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=16,
                                     write_only=True, required=False)
    withdrawal = serializers.IntegerField(min_value=0,
                                          write_only=True, required=False)

    class Meta:
        model = ATMUser
        fields = ('card', 'password', 'cash',
                  'is_blocked', 'withdrawal', 'version')

    def create(self, validated_data):
        atmuser = ATMUser.objects.create_user(**validated_data)

        op = Operation(code=Operation.CARD_CREATED,
                       atmuser=atmuser, cash=atmuser.cash)
        op.save()

        return atmuser

    def update(self, instance, validated_data):
        instance.version = validated_data.get('version', instance.version)
        withdrawal = validated_data.get('withdrawal', 0)

        if withdrawal > instance.cash:
            op = Operation(code=Operation.WITHDRAWAL_FAILURE_NOCASH,
                           withdrawal=withdrawal,
                           cash=instance.cash,
                           atmuser=instance)
            op.save()
            raise NotEnoughCashError()

        instance.cash -= withdrawal
        instance.save()

        op = Operation(code=Operation.WITHDRAWAL_SUCCESS,
                       atmuser=instance,
                       withdrawal=withdrawal,
                       cash=instance.cash)
        op.save()

        return instance


class OperationSerializer(serializers.ModelSerializer):
    atmuser = serializers.HyperlinkedRelatedField(read_only=True,
                                                  view_name='atmuser-detail',
                                                  lookup_field='card')

    class Meta:
        model = Operation
        fields = ('id', 'code', 'registered_at',
                  'atmuser', 'withdrawal', 'cash', 'add_info')
        read_only_fields = fields
