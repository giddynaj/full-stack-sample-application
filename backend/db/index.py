import sqlite3
import json
import time
import pandas as pd
from sqlite3 import Error

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
    query = "alter table Playlists add ratings int default 0;"
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

def load_data_into_df():
    cursor, conn = establish_connection()
    query = "select * from Playlists"
    df = pd.read_sql_query(query, conn)
    conn.close()
    print('data from df', df)
    return df

def update_dataframe(item):
    cursor, conn = establish_connection()
    query = "update Playlists set ratings = ? where id = ?;"
    cursor.execute(query, (item.rating, item.id))
    conn.commit()
    conn.close()

def get_danceability():
    try:
        cursor, conn = establish_connection()
        query = "select id, danceability, round(abs(random()) / 9223372036854775807.0 * 0.1, 3) AS value from Playlists;"
        cursor.execute(query)
        results = cursor.fetchall()
        conn.commit()
        parsed_results = [{"id":result[0], "x": result[1], "y": result[2]} for result in results]
        return parsed_results
    except Error as e:
        print(f"A database error occured {e}")
    finally:
        if conn:
            conn.close()

def get_duration():
    try:
        cursor, conn = establish_connection()
        query = "select id, duration_ms from Playlists;"
        cursor.execute(query)
        results = cursor.fetchall()
        conn.commit()
        parsed_results = [{"id":result[0], "duration_ms": result[1]} for result in results]
        return parsed_results
    except Error as e:
        print(f"A database error occured {e}")
    finally:
        if conn:
            conn.close()

def get_acoustics_tempo():
    try:
        cursor, conn = establish_connection()
        query = "select id, acousticness, tempo from Playlists;"
        cursor.execute(query)
        results = cursor.fetchall()
        conn.commit()
        parsed_results = [{"id":result[0], "acousticness": result[1], "tempo": result[2]} for result in results]
        return parsed_results
    except Error as e:
        print(f"A database error occured {e}")
    finally:
        if conn:
            conn.close()
