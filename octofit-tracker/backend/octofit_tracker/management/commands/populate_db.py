from django.core.management.base import BaseCommand
from django.utils import timezone
import pymongo

from octofit_tracker.models import Team, User, Activity, Workout, LeaderboardEntry


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data by dropping the database directly to avoid
        # Django delete collector issues with Djongo/ObjectId primary keys.
        try:
            client = pymongo.MongoClient('localhost', 27017)
            client.drop_database('octofit_db')
        except Exception as e:
            self.stderr.write(self.style.WARNING(f'Could not drop octofit_db via pymongo: {e}'))
            # Fallback to ORM deletes (may fail on some Djongo setups)
            try:
                LeaderboardEntry.objects.all().delete()
                Activity.objects.all().delete()
                Workout.objects.all().delete()
                User.objects.all().delete()
                Team.objects.all().delete()
            except Exception as e2:
                self.stderr.write(self.style.ERROR(f'Fallback ORM deletion also failed: {e2}'))
                return

        # Create teams
        marvel = Team.objects.create(name='marvel')
        dc = Team.objects.create(name='dc')

        # Create sample users (super heroes)
        users = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'team': marvel},
            {'name': 'Captain America', 'email': 'captain@marvel.com', 'team': marvel},
            {'name': 'Thor', 'email': 'thor@marvel.com', 'team': marvel},
            {'name': 'Batman', 'email': 'batman@dc.com', 'team': dc},
            {'name': 'Superman', 'email': 'superman@dc.com', 'team': dc},
            {'name': 'Wonder Woman', 'email': 'wonder@dc.com', 'team': dc},
        ]

        created_users = []
        for u in users:
            created_users.append(User.objects.create(name=u['name'], email=u['email'], team=u['team']))

        # Create activities
        for user in created_users:
            Activity.objects.create(user=user, activity_type='run', duration_minutes=30, distance_km=5.0)
            Activity.objects.create(user=user, activity_type='cycle', duration_minutes=45, distance_km=15.0)

        # Create workouts
        now = timezone.now()
        for user in created_users:
            Workout.objects.create(user=user, title='Full Body', notes='Sample workout', performed_at=now)

        # Leaderboard
        for i, user in enumerate(created_users, start=1):
            LeaderboardEntry.objects.create(user=user, points=100 - i * 5, rank=i)

        self.stdout.write(self.style.SUCCESS('Database populated with sample data'))
