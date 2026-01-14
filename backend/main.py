from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sqlite3
import db.index as db

origins = [
    'http://localhost:5173'
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

db.ensure_db_and_data('Playlists', './playlists.json')

#class BaseUser(BaseModel):
#    username: str
#    email: EmailStr
#    full_name: str | None = None

@app.get("/")
async def initialize():
    #check if table exists
    #print(df.transpose())
    return { "status": "ok"}

# rating, song id

@app.post("/rating")
async def post_rating():
    #rating_stars
    #song_id
# add column to playlists called rating type number
# find the row where id = song_id
# update row with the rating number in rating column.
# respond with 200 if successful
# respond with 4xx with error

@app.get("/playlists")
async def get_playlists(
    title: str | None = None,
    limit: int | None = 10,
    page: int | None = 1
):
    if (title):
        df_prep = df[df['title'] == title]
    else:
        skip = (page - 1) * 10
        df_prep = df.iloc[skip:limit + skip]
        #TODO: Default sort, other sort is implemented client side
        df_prep = df_prep.sort_values(by='title', ascending=True)
    print('df prep', df_prep)
    df_json = df_prep.to_json(orient='records')
    print('df json', df_json)
    #return { "status": "ok", "title": title, "totalCount": 100, "json": df_json}
    return df_json
