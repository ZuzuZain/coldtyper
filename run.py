"""
run.py will start the app
use `python run.py` to launch the Flask dev server
"""

from app import create_app, db
from app.models import User, TestResult

app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "User": User, "TestResult": TestResult}


if __name__ == "__main__":
    app.run(debug=True)
