from rest_framework import serializers
from .models import Team, User, Activity, Workout, LeaderboardEntry
from bson import ObjectId


def _convert_objids(obj):
    if isinstance(obj, dict):
        return {k: _convert_objids(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_objids(v) for v in obj]
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj


class BaseModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return _convert_objids(data)


class TeamSerializer(BaseModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class UserSerializer(BaseModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ActivitySerializer(BaseModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class WorkoutSerializer(BaseModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class LeaderboardEntrySerializer(BaseModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = '__all__'
