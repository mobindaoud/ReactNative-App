from django.shortcuts import render

def Home(request):
    return render(request,'templates/Home.html')

def services(request):
    return render(request,'templates/services.html')

def contact(request):
    return render(request,'templates/contact.html')

def about(request):
    return render(request,'templates/about.html')
