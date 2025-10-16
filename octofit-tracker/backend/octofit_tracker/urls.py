"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from octofit_tracker import views
from django.http import HttpRequest
import os


def api_root_codespace(request, format=None):
    """Wrapper around views.api_root that forces the request's scheme and
    host information to match the Codespace URL when CODESPACE_NAME is set.

    This avoids modifying `views.py` while making the returned absolute
    URLs use https://$CODESPACE_NAME-8000.app.github.dev.
    """
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        # construct the host used by the Codespace forwarded URL
        host = f"{codespace_name}-8000.app.github.dev"
        # modify incoming request.META in-place so DRF builds absolute URLs
        old_scheme = request.META.get('wsgi.url_scheme')
        old_host = request.META.get('HTTP_HOST')
        try:
            request.META['wsgi.url_scheme'] = 'https'
            request.META['HTTP_HOST'] = host
            # ensure method is present (should already be set for real requests)
            if not getattr(request, 'method', None):
                request.method = 'GET'
            return views.api_root(request, format=format)
        finally:
            # restore previous values to avoid side-effects
            if old_scheme is None:
                request.META.pop('wsgi.url_scheme', None)
            else:
                request.META['wsgi.url_scheme'] = old_scheme
            if old_host is None:
                request.META.pop('HTTP_HOST', None)
            else:
                request.META['HTTP_HOST'] = old_host
    # fallback: behave like original api_root
    return views.api_root(request, format=format)

router = routers.DefaultRouter()
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'workouts', views.WorkoutViewSet, basename='workout')
router.register(r'leaderboard', views.LeaderboardEntryViewSet, basename='leaderboardentry')

urlpatterns = [
    # use the wrapper so returned absolute URLs match Codespace public URL
    path('', api_root_codespace, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
