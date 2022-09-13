from django.conf.urls import url 
from base import views 
 
urlpatterns = [ 
    url(r'^api/articles$', views.articles_list),
    url(r'^api/articles/(?P<pk>[0-9]+)$', views.article_detail),
]