from django.db import models
from djongo.models import ObjectIdField


class Team(models.Model):
    id = ObjectIdField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class User(models.Model):
    id = ObjectIdField(primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, related_name='members', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"


class Activity(models.Model):
    id = ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, related_name='activities', on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField()
    distance_km = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} by {self.user.email} on {self.timestamp}"


class Workout(models.Model):
    id = ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, related_name='workouts', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    performed_at = models.DateTimeField()

    def __str__(self):
        return f"{self.title} by {self.user.email} at {self.performed_at}"


class LeaderboardEntry(models.Model):
    id = ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, related_name='leaderboard_entries', on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    rank = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-points']

    def __str__(self):
        return f"{self.user.email}: {self.points} pts"
