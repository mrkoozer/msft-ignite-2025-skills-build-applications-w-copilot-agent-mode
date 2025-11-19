from rest_framework import serializers

from .models import Activity, Leaderboard, Team, User, Workout


class ObjectIdField(serializers.CharField):
    """Ensure ObjectId values get serialized as strings."""

    def to_representation(self, value):
        if value is None:
            return value
        return str(value)


class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Team
        fields = ('id', 'name', 'description')


class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team_id = ObjectIdField(source='team.id', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'team', 'team_id', 'team_name')


class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user_id = ObjectIdField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Activity
        fields = (
            'id',
            'user',
            'user_id',
            'user_name',
            'type',
            'duration',
            'calories',
            'date',
        )


class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Workout
        fields = ('id', 'name', 'description', 'difficulty')


class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team_id = ObjectIdField(source='team.id', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = Leaderboard
        fields = ('id', 'team', 'team_id', 'team_name', 'points', 'rank')
