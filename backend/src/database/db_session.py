import os
import logging
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Loading the environment variables from .env
load_dotenv()

Base = declarative_base()

class Database:
    """ This Class contains all the methods related to the Database utitlities."""
    
    def __init__(self):

        # Configuring the Database Username,password details.
        try:
            self.db_username = os.environ["DB_USERNAME"]
            self.db_password = os.environ["DB_PASSWORD"]
        except KeyError as e:
            logging.error(f'Missing environment variable: {e}')
            raise

        self.db_host = os.environ["DB_HOST"]
        self.db_name = os.environ["DB_NAME"]  # Replace with your database name if it's not "postgres"

        try:
            # Default to the "public" schema
            connectionString = f'postgresql://{self.db_username}:{self.db_password}@{self.db_host}/{self.db_name}'
            print(connectionString)
            self.engine = create_engine(
                connectionString,
                echo=False,
                connect_args={'options': '-csearch_path=public'}  # Use the "public" schema
            )
        except Exception as e:
            logging.error(f'Error while connecting to the database: {e}')
            raise

        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_session(self):
        """ This function returns the object of SessionLocal."""
        session = self.SessionLocal()
        try:
            return session
        finally:
            session.close()

    def database_connection(self):
        """This function is used to connect with the Database."""
        cnx = None
        cursor = None
        try:
            cnx = psycopg2.connect(
                        user=self.db_username, 
                                password=self.db_password, 
                                host=self.db_host, 
                                port=5432,
                                database=self.db_name)
            cursor = cnx.cursor()
            return cnx, cursor
        except Exception as e:
            logging.error(f'Exception in Connecting Database: {e}')
            return