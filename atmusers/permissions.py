from rest_framework import permissions


class ATMUserPermission(permissions.BasePermission):
    """"""
    def has_permission(self, request, view):
        if request.user.is_blocked:
            return False

        if request.method in permissions.SAFE_METHODS + ('PATCH', 'PUT'):
            card = view.kwargs.get('card')
            return (request.user.is_staff or card is None or
                    card == request.user.card)
        elif request.method in ('POST', 'DELETE'):
            return request.user.is_staff
        else:
            return super(ATMUserPermission, self).has_permission(request, view)

    def has_object_permission(self, request, view, obj=None):
        if request.method in ('GET', 'HEAD'):
            return request.user == obj or request.user.is_staff
        if request.method in ('PATCH', 'PUT'):
            return request.user == obj and not request.user.is_blocked
        elif request.method in ('POST', 'DELETE'):
            return request.user.is_staff
        else:
            return super(ATMUserPermission,
                         self).has_object_permission(request, view, obj)


class ATMUserOperationsPermission(permissions.BasePermission):
    """"""
    def has_permission(self, request, view):
        if request.user.is_blocked:
            return False

        if request.method in ('GET', 'HEAD'):
            return (request.user.is_staff or
                    request.user.card == view.kwargs.get('atmuser_card'))
        elif request.method in permissions.SAFE_METHODS:
            return True

        return False

    def has_object_permission(self, request, view, obj=None):
        return request.method in permissions.SAFE_METHODS


class OperationPermission(ATMUserOperationsPermission):
    """"""
    def has_permission(self, request, view):
        if request.user.is_blocked:
            return False

        return self.has_object_permission(request, view)
