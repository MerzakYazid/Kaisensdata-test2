from rest_framework import serializers
from base.models import *

class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = ('id',
                'title',
                'description',
                'published')