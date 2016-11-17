from django.conf import settings
from django.conf.urls import include, url, patterns
from django.contrib import admin

from django.contrib.staticfiles import views

from rest_framework_nested import routers

from atmusers.views import (
    IndexView,
    ATMUserViewSet,
    ATMUserOperationsViewSet,
    OperationViewSet,
    LoginView,
    LogoutView,
    BlockCardView,
)

router = routers.SimpleRouter()
router.register(r'atmusers', ATMUserViewSet)
router.register(r'operations', OperationViewSet)

atmusers_router = routers.NestedSimpleRouter(router,
                                             r'atmusers',
                                             lookup='atmuser')
atmusers_router.register(r'operations', ATMUserOperationsViewSet)

admin.autodiscover()

urlpatterns = [
    url('^$', IndexView.as_view()),
    url(r'^api/', include(router.urls)),
    url(r'^api/', include(atmusers_router.urls)),
    url(r'^api/login/(?P<card>[^/.]+)?$', LoginView.as_view(), name='login'),
    url(r'^api/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/blockcard/$', BlockCardView.as_view(), name='block_card'),
    url(r'^api-auth/', include('rest_framework.urls',
        namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
]

if not settings.DEBUG:
    urlpatterns += url(r'^{0}(?P<path>.*)$'.format(
        settings.STATIC_URL.lstrip('/')), views.serve, dict(insecure=True)),
