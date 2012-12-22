(ns tagbook.core
  (:use compojure.core)
  (:use [clojure.string :only (split)])
  (:require [clojure.data.json :as json]
            [compojure.route :as route]
            [tagbook.elasticsearch :as datastore]))

(defn deserialise [httpInput]
  (json/read-json (slurp httpInput :encoding "UTF8")))

(defn cors-response [body]
  {:body body :headers {"Access-Control-Allow-Origin" "*"
                        "Access-Control-Allow-Headers" "X-Requested-With"}})

(defn save [req]
  (let [data (deserialise (:body req))]
    (datastore/save data)
    (cors-response {:ok true})))

(defn search [{params :params :as req}]
  (let [query (:query params)
        findings (datastore/query query)]
    (cors-response (json/write-str findings))))

(defroutes app
  (GET "/" [] "Welcome to Tagbook!")
  (GET "/search/:query" [] search)
  (POST "/bookmark" [] save)
  (route/not-found "<h1>Page not found</h1>"))