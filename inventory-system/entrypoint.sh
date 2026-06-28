#!/bin/sh

echo "Waiting PostgreSQL..."

until python manage.py migrate
do
    echo "Database unavailable..."
    sleep 5
done

python manage.py seed

python manage.py runserver 0.0.0.0:8000