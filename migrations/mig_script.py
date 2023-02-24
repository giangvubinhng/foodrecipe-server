#mysql --user=foodrec --password=frAdmin foodrecipe < frlocal.sql
import os
import argparse
from dotenv import load_dotenv
from pathlib import Path

def run_migration():

    dotenv_path = Path('../.env')
    load_dotenv(dotenv_path)

    username = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    default_filename = 'frlocal.sql'

    parser = argparse.ArgumentParser()
    parser.add_argument("-s", "--source", help = "file to source", required = False, default = default_filename)
    parser.add_argument("-u", "--user", help = "database user", required = False, default = username)
    parser.add_argument("-p", "--password", help = "database user's password", required = False, default = password)
    argument = parser.parse_args()



    command = f'mysql --user={argument.user} --password={argument.password} foodrecipe -e "source {argument.source}"'
    os.system(command)


if __name__ == '__main__':
    run_migration()
