from django.shortcuts import render, redirect, get_object_or_404

from inventory.models import Item
from inventory.forms import ItemForm

def item_list(request):
    items = Item.objects.order_by("name")

    return render(
        request,
        "inventory/item_list.html",
        {
            "items": items,
        },
    )


def item_create(request):
    if request.method == "POST":
        form = ItemForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("item_list")

    else:
        form = ItemForm()

    return render(
        request,
        "inventory/item_form.html",
        {
            "form": form,
            "title": "Create Item",
        },
    )


def item_update(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == "POST":
        form = ItemForm(request.POST, instance=item)

        if form.is_valid():
            form.save()
            return redirect("item_list")

    else:
        form = ItemForm(instance=item)

    return render(
        request,
        "inventory/item_form.html",
        {
            "form": form,
            "title": "Edit Item",
        },
    )


def item_delete(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == "POST":
        item.delete()
        return redirect("item_list")

    return render(
        request,
        "inventory/item_delete.html",
        {
            "item": item,
        },
    )