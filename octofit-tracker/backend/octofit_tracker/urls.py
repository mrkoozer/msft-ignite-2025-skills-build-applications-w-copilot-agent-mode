"""octofit_tracker URL Configuration."""

import os
from collections import OrderedDict

from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from .views import (
    ActivityViewSet,
    LeaderboardViewSet,
    TeamViewSet,
    UserViewSet,
    WorkoutViewSet,
)

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'users', UserViewSet, basename='user')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workout')


def _determine_base_url() -> str:
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        return f"https://{codespace_name}-8000.app.github.dev"
    return "http://localhost:8000"


def _build_route_map(base_url: str) -> OrderedDict:
    routes = OrderedDict()
    for prefix, _viewset, _basename in router.registry:
        routes[prefix] = f"{base_url}/api/{prefix}/"
    return routes


@api_view(['GET'])
def api_root(request):
    """Return API directory with codespace-aware URLs."""

    base_url = _determine_base_url()
    return Response(
        {
            'base_url': base_url,
            'routes': _build_route_map(base_url),
        }
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='home'),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
