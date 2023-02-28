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
    return HttpResponse('<h1 style="color:red">Goodbye World!!</h1>')

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