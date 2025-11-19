import os

from django.urls import reverse
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Activity, Leaderboard, Team, User, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)


class TeamViewSet(BaseViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class UserViewSet(BaseViewSet):
    queryset = User.objects.select_related('team').all()
    serializer_class = UserSerializer


class ActivityViewSet(BaseViewSet):
    queryset = Activity.objects.select_related('user', 'user__team').all()
    serializer_class = ActivitySerializer


class WorkoutViewSet(BaseViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer


class LeaderboardViewSet(BaseViewSet):
    queryset = Leaderboard.objects.select_related('team').all()
    serializer_class = LeaderboardSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """Surface a small directory of API links for the frontend."""

    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"

    def absolute(name):
        return request.build_absolute_uri(reverse(name))

    return Response(
        {
            'base_url': base_url,
            'routes': {
                'teams': absolute('team-list'),
                'users': absolute('user-list'),
                'activities': absolute('activity-list'),
                'leaderboard': absolute('leaderboard-list'),
                'workouts': absolute('workout-list'),
            },
        }
    )
