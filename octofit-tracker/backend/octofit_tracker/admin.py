from django.contrib import admin

from .models import Activity, Leaderboard, Team, User, Workout


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
	list_display = ('name', 'description')
	search_fields = ('name',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'team')
	list_filter = ('team',)
	search_fields = ('name', 'email')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
	list_display = ('type', 'user', 'duration', 'calories', 'date')
	list_filter = ('type', 'date')
	search_fields = ('user__name', 'type')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
	list_display = ('name', 'difficulty')
	list_filter = ('difficulty',)
	search_fields = ('name',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
	list_display = ('team', 'rank', 'points')
	list_filter = ('rank',)
