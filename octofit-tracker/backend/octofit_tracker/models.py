from djongo import models


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'teams'
        ordering = ('name',)

    def __str__(self) -> str:
        return self.name


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')

    class Meta:
        db_table = 'users'
        ordering = ('name',)

    def __str__(self) -> str:
        return f"{self.name} ({self.email})"


class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=50)
    duration = models.IntegerField()  # minutes spent doing the activity
    calories = models.IntegerField()
    date = models.DateField()

    class Meta:
        db_table = 'activities'
        ordering = ('-date',)

    def __str__(self) -> str:
        return f"{self.type} - {self.user.name} ({self.date})"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=50)

    class Meta:
        db_table = 'workouts'
        ordering = ('name',)

    def __str__(self) -> str:
        return f"{self.name} - {self.difficulty}"


class Leaderboard(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='leaderboard')
    points = models.IntegerField()
    rank = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'
        ordering = ('rank',)

    def __str__(self) -> str:
        return f"{self.team.name} - #{self.rank}"
