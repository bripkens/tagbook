(defproject tagbook "1.0.0-SNAPSHOT"
  :description "Taggable bookmarks"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/data.json "0.2.1"]
                 [clojurewerkz/elastisch "1.0.2"]
                 [compojure "1.1.3"]
                 [org.clojure/tools.logging "0.2.4"]]
  :plugins [[lein-ring "0.7.1"]]
  :ring {:handler tagbook.core/app})
