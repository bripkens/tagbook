(ns tagbook.datastore
  (:require [clojurewerkz.welle.core :as wc]
            [clojurewerkz.welle.buckets :as wb]
            [clojurewerkz.welle.kv :as kv]))

(def ^{:private true} bucket "bookmark")

(defn- ensure-connected! []
  (wc/connect!)
  (wb/create bucket))

(defn fetch-with-meta [id]
  (ensure-connected!)
  (kv/fetch bucket id))

(defn fetch [id]
  (:value (nth (fetch-with-meta id) 0)))

(defn query [query]
  (ensure-connected!)
  (map fetch (kv/index-query bucket :tags query)))

(defn save! [record]
  (ensure-connected!)
  (let [id (:id record) tags (set (:tags record))]
    (kv/store bucket id record
      :content-type "application/json"
      :indexes {:tags tags})))