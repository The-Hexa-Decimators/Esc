"""helloWorld URL Configuration

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

from django.urls import path
from .views import hello
from . import views
from django.urls import path
from .views import get_nearby_escape_rooms

urlpatterns = [
    path('', hello),
    path('helloWorldApp/', views.ApiOverview, name='home'),
    path('create/', views.add_items, name='add-items'),
    path('all/', views.view_items, name='view_items'),
    path('home_view/', views.home_view, name = 'home_view'),
    path('graph/', views.graph_view, name='graph-view'),
    path('escape_rooms/', get_nearby_escape_rooms, name='escape_rooms'),
]