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
df = db.load_data_into_df()



@app.get("/")
async def initialize():
    #check if table exists
    #print(df.transpose())
    return { "status": "ok"}

# rating, song id


class Item(BaseModel):
    id: str
    rating: int

@app.put("/ratings")
async def put_rating(item: Item):
    db.update_rating_db(item)
    condition = df['id'] == item.id
    df.loc[condition, 'ratings'] = item.rating
    return { "status": "ok"}


# add column to playlists called rating type number
# find the row where id = song_id
# update row with the rating number in rating column.
# respond with 200 if successful
# respond with 4xx with error

#class BaseUser(BaseModel):
#    username: str
#    email: EmailStr
#    full_name: str | None = None
@app.get("/duration-bar")
async def get_duration_bar():
    results = db.get_duration_bar()
    return { "status": "ok", "data": results }

@app.get("/acoustic")
async def get_acoustic():
    results = db.get_acoustic()
    return { "status": "ok", "data": results }

@app.get("/duration")
async def get_duration():
    results = db.get_duration()
    return { "status": "ok", "data": results }


@app.get("/danceability")
async def get_danceability():
    results = db.get_danceability()
    return { "status": "ok", "data": results }

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
    df_json = df_prep.to_dict(orient='records')
    return { "status": "ok", "title": title, "totalCount": 100, "json": df_json}
