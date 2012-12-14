(defproject tagbook "1.0.0-SNAPSHOT"
  :description "Taggable bookmarks"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/data.json "0.2.1"]
                 [com.novemberain/welle "1.3.1"]
                 [compojure "1.1.3"]]
  :plugins [[lein-ring "0.7.1"]]
  :ring {:handler tagbook.core/app})
