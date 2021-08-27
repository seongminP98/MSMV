from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from flask import Flask, jsonify, request

import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
load_dotenv(verbose=True)
csvPath = os.getenv('CSV_PATH')

df = pd.read_csv(csvPath+'/movieDataSet.csv')

tfidf = TfidfVectorizer()
df['summary'] = df['summary'].fillna('')
tfidf_matrix = tfidf.fit_transform(df['summary'])
app = Flask(__name__)

cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

indices = pd.Series(df.index, index=df['movieCode']).drop_duplicates()


def get_recommendations(movieCode, size, cosine_sim=cosine_sim):
    idx = indices[movieCode]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:size+1]
    movie_indices = [i[0] for i in sim_scores]
    score = [i[1] for i in sim_scores]
    return df['movieCode'].iloc[movie_indices]


@app.route('/<movieCode>')
def home(movieCode):
    movieCd = int(movieCode)
    try:
        movies = get_recommendations(movieCd, 15)
    except:
        app.logger.info("error")
        data = "error"
    else:
        app.logger.info("complete")
        data = movies.to_json(orient='columns', force_ascii=False)
    finally:
        app.logger.info(data)
        return data


@app.route('/personal/<movieCode>')
def personal(movieCode):
    movieCd = int(movieCode)
    try:
        movies = get_recommendations(movieCd, 5)
    except:
        app.logger.info("error")
        data = "error"
    else:
        app.logger.info("complete")
        data = movies.to_json(orient='columns', force_ascii=False)
    finally:
        app.logger.info(data)
        return data


if __name__ == '__main__':
    app.run(debug=True)
