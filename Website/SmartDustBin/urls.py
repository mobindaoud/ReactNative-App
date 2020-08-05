from django.urls import path
from .import views
app_name='SmartDustBin'
urlpatterns = [

    path('',views.Home,name="Home"),
    #path('gallery',views.gallery,name="gallery"),
    path('contact',views.contact,name="contact"),
    path('about/',views.about,name="about"),
    path('services/',views.services,name="services"),


]
