from rest_framework import serializers
from .models import Team, User, Activity, Workout, LeaderboardEntry
from bson import ObjectId
import pymongo


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
        data = _convert_objids(data)
        # Ensure the primary key (ObjectId) is exposed as a string 'id'
        try:
            pk = getattr(instance, 'id', None) or getattr(instance, 'pk', None)
            if pk:
                data['id'] = str(pk)
            else:
                # Fallback: try to lookup the raw MongoDB _id using a unique field (email) if present
                try:
                    db_name = getattr(instance._state, 'db', None) or 'octofit_db'
                    client = pymongo.MongoClient('localhost', 27017)
                    db = client[db_name]
                    coll_name = instance._meta.db_table
                    query = {}
                    if hasattr(instance, 'email') and instance.email:
                        query['email'] = instance.email
                    elif hasattr(instance, 'name') and instance.name:
                        query['name'] = instance.name
                    if query:
                        doc = db[coll_name].find_one(query)
                        if doc and '_id' in doc:
                            data['id'] = str(doc['_id'])
                except Exception:
                    pass
        except Exception:
            # fallback: leave as-is
            pass
        return data


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
