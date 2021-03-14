"""Define db"""
from app import DB


class Person(DB.Model):
    """Models to define fields in db"""
    username = DB.Column(DB.String(120), primary_key=True)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Person %r %d>' % (self.username, self.score)
