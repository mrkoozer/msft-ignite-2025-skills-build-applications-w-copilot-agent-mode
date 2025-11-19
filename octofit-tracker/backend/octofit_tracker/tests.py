from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Team, User


class APIRootTests(APITestCase):
    def test_root_links_available(self):
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        routes = response.data.get('routes', {})
        self.assertIn('teams', routes)
        self.assertIn('users', routes)
        self.assertIn('activities', routes)


class UserWorkflowTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Unit test team')

    def test_create_and_list_user(self):
        payload = {
            'name': 'Amy Athlete',
            'email': 'amy@example.com',
            'team': str(self.team.id),
        }
        create_response = self.client.post(reverse('user-list'), payload, format='json')
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data['team_id'], str(self.team.id))

        list_response = self.client.get(reverse('user-list'))
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data[0]['email'], 'amy@example.com')


class ActivityWorkflowTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Runner Squad', description='Distance runners')
        self.user = User.objects.create(name='Runner One', email='runner@example.com', team=self.team)

    def test_create_activity(self):
        payload = {
            'user': str(self.user.id),
            'type': 'Run',
            'duration': 45,
            'calories': 500,
            'date': '2024-01-01',
        }
        response = self.client.post(reverse('activity-list'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user_id'], str(self.user.id))
