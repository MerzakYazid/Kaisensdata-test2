from multiprocessing import managers
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from base.models import Article
from base.serializers import ArticleSerializer
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['GET','POST','DELETE'])
def articles_list(request):
    if request.method == 'GET':
        articles = Article.objects.all()
        article_serializer = ArticleSerializer(articles, many=True)
        return JsonResponse(article_serializer.data, safe=False)
    elif request.method == 'POST':
        article_data = JSONParser().parse(request)
        article_serializer = ArticleSerializer(data=article_data)
        if article_serializer.is_valid():
            article_serializer.save()
            return JsonResponse(article_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        count = Article.objects.all().delete()
        return JsonResponse({'message': '{} Articles were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)

    
@api_view(['GET','PUT','DELETE'])
def article_detail(request, pk):
    article = Article.objects.get(pk=pk)
    if (request.method == 'GET'):
        article_serializer = ArticleSerializer(article)
        return JsonResponse(article_serializer.data, safe=False)
    elif request.method == 'PUT': 
        article_data = JSONParser().parse(request) 
        article_serializer = ArticleSerializer(article, data=article_data) 
        if article_serializer.is_valid(): 
            article_serializer.save() 
            return JsonResponse(article_serializer.data) 
        return JsonResponse(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    elif request.method == 'DELETE': 
        article.delete() 
        return JsonResponse({'message': 'Article was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)



