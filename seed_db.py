# ~/seed_db.py will fill the database with data to assist with testing 
from app import create_app, db
from app.models import User, TestResult


def seed_database():
    app = create_app("development")
    with app.app_context():
        # clear existing data
        db.drop_all()
        db.create_all()

        # create users
        user1 = User(username="user1")
        user1.set_password("password1")
        user2 = User(username="user2")
        user2.set_password("password2")
        db.session.add_all([user1, user2])
        db.session.commit()

        # create test results
        result1 = TestResult(user_id=1, wpm=60, accuracy=95, round_length=60)
        result2 = TestResult(user_id=2, wpm=75, accuracy=98, round_length=60)
        # add the data to the database 
	db.session.add_all([result1, result2])
        db.session.commit() 

        print("database seeded successfully!")


if __name__ == "__main__":
    seed_database()
