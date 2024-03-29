from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer
from rest_framework import serializers
from rest_framework import status
from bokeh.plotting import figure, output_file, show


# Create your views here.
def hello(request):
    return render(request, "CS4800.html")

@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'all_items': '/',
        'Search by Category': '/?category=category_name',
        'Search by Subcategory': '/?subcategory=category_name',
        'Add': '/create',
        'Update': '/update/pk',
        'Delete': '/item/pk/delete'
    }
 
    return Response(api_urls)

@api_view(['POST'])
def add_items(request):
    item = ItemSerializer(data=request.data)
 
    # validating for already existing data
    if Item.objects.filter(**request.data).exists():
        raise serializers.ValidationError('This data already exists')
 
    if item.is_valid():
        item.save()
        return Response(item.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def view_items(request):
     
     
    # checking for the parameters from the URL
    if request.query_params:
        items = Item.objects.filter(**request.query_params.dict())
    else:
        items = Item.objects.all()
 
    # if there is something in items else raise error
    if items:
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

def home_view(request):
    return render(request, "home.html")

def graph_view(request):
    # instantiating the figure object
    graph = figure(title = "Bokeh Line Graph")
 
    # the points to be plotted
    x = [1, 2, 3, 4, 5]
    y = [1, 2, 5, 2, 1]
    
    # plotting the line graph
    graph.line(x, y)
 
    # displaying the model
    show(graph)



import requests
import json
from django.http import JsonResponse
from django.shortcuts import render

API_KEY = "6UZ8qgyaZYPX87PpD5Qk-9UOFRnpnuKymGdKlrTRjvtLYMqnDuTcQMlQgTEqcHFeIZ-sqUqN9qjm0wcAYNT6c4_3SCmaK3SKJSE027bAKyAAKX6SAzPC2_V2zWJQZHYx"

def get_nearby_escape_rooms(request):
    location = request.GET.get('location')
    headers = {"Authorization": f"Bearer {API_KEY}"}
    url = "https://api.yelp.com/v3/businesses/search"
    params = {"term": "Escape Rooms", "location": location}
    response = requests.get(url, headers=headers, params=params)
    data = json.loads(response.text)
    escape_rooms = []
    for business in data.get("businesses", []):
        escape_room = {
            "name": business["name"],
            "rating": business["rating"],
            "location": business["location"]["address1"],
            "phone": business["phone"],
            "url": business["url"],
            "image_url": business["image_url"],
            "display_address": business["location"]["display_address"],
            "display_phone": business["display_phone"],
        }
        escape_rooms.append(escape_room)
    return JsonResponse(escape_rooms, safe=False)