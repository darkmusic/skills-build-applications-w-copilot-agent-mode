from django.contrib import admin
from .models import Team, User, Activity, Workout, LeaderboardEntry


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'team')
    search_fields = ('email', 'name')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'activity_type', 'duration_minutes', 'timestamp')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'performed_at')


@admin.register(LeaderboardEntry)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'points', 'rank')
