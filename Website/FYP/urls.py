from django.contrib import admin
from django.urls import path,include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static
from .import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('SmartDustBin.urls')),
    path('index/',views.index)
]
urlpatterns += staticfiles_urlpatterns()
