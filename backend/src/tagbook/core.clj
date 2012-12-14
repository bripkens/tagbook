(ns tagbook.core
  (:use compojure.core)
  (:use [clojure.string :only (split)])
  (:require [clojure.data.json :as json]
            [compojure.route :as route]
            [tagbook.datastore :as datastore]))

(defn deserialise [httpInput]
  (json/read-json (slurp httpInput :encoding "UTF8")))

(defn uuid [] (str (java.util.UUID/randomUUID)))

(defn make-record [data] (assoc data :id (uuid)))

(defn cors-response [body]
  {:body body :headers {"Access-Control-Allow-Origin" "*"
                        "Access-Control-Allow-Headers" "X-Requested-With"}})

(defn save [req]
  (let [data (deserialise (:body req))
        record (make-record data)]
    (datastore/save! record)
    (cors-response (json/write-str record))))

(defn extract-words [params]
  (filter #(not (empty? %)) (split (:query params) #"[ ,]+")))

(defn search [{params :params :as req}]
  (let [query (extract-words params)
        findings (datastore/query query)]
    (cors-response (json/write-str findings))))

(defroutes app
  (GET "/" [] "Welcome to Tagbook!")
  (GET "/search/:query" [] search)
  (POST "/bookmark" [] save)
  (route/not-found "<h1>Page not found</h1>"))