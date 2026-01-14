import sqlite3
import json
import time

DB_FILE= './app.db'

def establish_connection():
    #cursor
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    return (cursor, conn)

def table_exists(cursor, table_name):
    #tableExists
    query = "select * from sqlite_master where type='table' and name=?;"
    cursor.execute(query, (table_name,))
    result = cursor.fetchone()
    print('table exists fetchone', bool(result))
    return bool(result)

def create_table(table_name, json_file):
    cursor, conn = establish_connection()
    if not table_exists(cursor, table_name):

        # Create sql to create table (adjust data types as needed, TEXT is versatile)
        create_table_sql = f"""
            CREATE TABLE IF NOT EXISTS {table_name}
            (
                id text,
                title text,
                danceability float,
                energy float,
                key float,
                loudness float,
                mode float,
                acousticness float,
                instrumentalness float,
                liveness float,
                valence float,
                tempo float,
                duration_ms int,
                time_signature int,
                num_bars int,
                num_sections int,
                num_segments int,
                class int
            )
            """
        # Create table (adjust data types as needed, TEXT is versatile)
        cursor.execute(create_table_sql)
        conn.commit
        conn.close

def data_exists(table_name):
    cursor, conn = establish_connection()
    query = "select count(*) from Playlists"
    print('query', query)
    cursor.execute(query)
    result = cursor.fetchone()
    return not bool( 0 in result)

def load_database(json_file, table_name):
    cursor, conn = establish_connection()

    with open(json_file, 'r') as f:
        data = json.load(f)

    if not data:
        return

    # #Uses first object to create columns
    # print('columns:', columns)
    columns = data.keys()

    # Setup sql to insert data
    placeholders = ', '.join(['?'] * len(columns))
    insert_sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
    print('insert_sql', insert_sql)
    rows_to_insert = [
    (   str(data['id'][k]),
        str(data['title'][k]),
        data['danceability'][k],
        data['energy'][k],
        data['key'][k],
        data['loudness'][k],
        data['mode'][k],
        data['acousticness'][k],
        data['instrumentalness'][k],
        data['liveness'][k],
        data['valence'][k],
        data['tempo'][k],
        data['duration_ms'][k],
        data['time_signature'][k],
        data['num_bars'][k],
        data['num_sections'][k],
        data['num_segments'][k],
        data['class'][k],
        ) for k in data["id"]]

    print('insert sql rows to inser', rows_to_insert)
    cursor.executemany(insert_sql, rows_to_insert)
    conn.commit()
    conn.close()
    return { "status":"200", "message":"Table does not exist"}

def add_rating_column():
    time.sleep(10)
    cursor, conn = establish_connection()
    query = "alter table Playlists add ratings int;"
    cursor.execute(query)
    conn.commit()
    conn.close()

def ensure_db_and_data(table_name, json_file):
    cursor, conn = establish_connection()
    if not table_exists(cursor, table_name):
        create_table(table_name, json_file)
        add_rating_column()
    if table_exists(cursor, table_name) and not data_exists(table_name):
        print('data exists:', data_exists(table_name))
        load_database(json_file, table_name)
