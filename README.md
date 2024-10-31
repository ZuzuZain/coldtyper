## SETUP

### Install the following:
1. Homebrew (for macOS): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
1. Python3.12 or higher
	- Windows: 
	  1a. `curl https://www.python.org/ftp/python/3.12.1/python-3.12.1-amd64.exe -o python-installer.exe`
	  1b. `python-installer.exe` 	
	- macOS: `brew install python3`
2. Git 
3. pip3 (python 3's package installer)
	- Windows: `python3 get-pip.py`
	- macOS: `brew install python3 (also downloads pip3)`
 
### backend
1. clone the repository with `git clone https://github.com/ZuzuZain/coldtyper.git` 
2. `cd` into coldtyper's root
3. create virtual environment by entering the following command: `python -m venv myenv`
4. activate virtual environment by: 
	- windows: `myenv\Scripts\activate`
	- macOS/Linux: `source myenv/Scripts/activate`
5. install dependencies: `pip install -r requirements.txt`
6. copy '.env.example' to '.env': `cp .env.example .env`
7. Initialize the DB: `flask  db upgrade`
8. To populate the DB with sample data: `python seed_db.py` 
