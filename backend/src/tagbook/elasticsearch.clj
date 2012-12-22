(ns tagbook.elasticsearch
  (:require [clojurewerkz.elastisch.rest :as esr]
            [clojurewerkz.elastisch.rest.index :as esi]
            [clojurewerkz.elastisch.rest.document :as esd]
            [clojurewerkz.elastisch.query :as q]
            [clojurewerkz.elastisch.rest.response :as esrsp]))

(def endpoint "http://127.0.0.1:9200")

(def bookmark-index "tagbook_bookmark")
(def bookmark-index-type "bookmark")
(def bookmark-mapping-types {:bookmark {:properties {
    :url          {:type "string" :store "yes"}
    :description  {:type "string" :store "yes" :analyzer "snowball"}
    :tags         {:type "string" :index_name "tag"}
    :scroll       {:type "integer" :store "yes" :null_value 0}}}})

(defn ensure-connected! [] (esr/connect! endpoint))

(defn setup []
  (ensure-connected!)
  (if (esi/exists? bookmark-index)
    (println format("Index %s already exists, skipping creation."
                    bookmark-index))
    (esi/create bookmark-index :mappings bookmark-mapping-types)))

(defn delete-index []
  (ensure-connected!)
  (esi/delete bookmark-index))

(defn save [bookmark]
  (ensure-connected!)
  (esd/create bookmark-index bookmark-index-type bookmark))

(defn to-generic-search-result [es-result]
  (map (fn [e] {:id (:_id e)
                :score (:_score e)
                :bookmark (:_source e)}) es-result))

(defn query [query]
  (ensure-connected!)
  (let [res (esd/search bookmark-index
                        bookmark-index-type
                        :query { :query_string {
                          :fields ["url^3" "description" "tags^10"]
                          :query query
                          :allow_leading_wildcard true
                          } })
        hits (esrsp/hits-from res)]
    (to-generic-search-result hits)))