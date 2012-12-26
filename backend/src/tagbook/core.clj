(ns tagbook.core
  (:use [compojure.core]
        [clojure.string :only (split)]
        [clojure.tools.logging :only (info error)])
  (:require [clojure.data.json :as json]
            [compojure.route :as route]
            [ring.util.response :as resp]
            [tagbook.elasticsearch :as datastore]))

(defn response [data]
  (-> (resp/response (json/write-str data))
      (resp/content-type "application/json")
      (resp/charset "UTF8")
      (resp/header "Access-Control-Allow-Origin" "*")
      (resp/header "Access-Control-Allow-Headers" "X-Requested-With")))

(defn save [req]
  (let [data (json/read-str (slurp (:body req) "UTF8"))]
    (datastore/save data)
    (info "Stored bookmark:" data)
    (response {:ok true})))

(defn search [{params :params :as req}]
  (let [query (:query params)
        findings (datastore/query query)]
    (info "Got queried for:" query)
    (response findings)))

(defroutes app
  (GET "/" [] (resp/file-response "index.html" {:root "resources/public"}))
  (GET "/info" [] (response {"ok" true}))
  (GET "/search/:query" [] search)
  (POST "/bookmark" [] save)
  (route/resources "/")
  (route/not-found "<h1>Page not found</h1>"))